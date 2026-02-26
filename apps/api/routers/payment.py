import os
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from datetime import date
import razorpay
from pydantic import BaseModel

from database import get_session
from models import User, Payment, PaymentStatus
from dependencies import get_current_user, clerk_client

router = APIRouter(prefix="/api/payment", tags=["Payment"])

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")

# Safe initialization
if RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET:
    client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
else:
    client = None

class CreatePaymentRequest(BaseModel):
    amount: int  # Amount in paise

class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

@router.post("/create")
async def create_order(
    req: CreatePaymentRequest,
    db: AsyncSession = Depends(get_session),
    user: User = Depends(get_current_user)
):
    if not client:
        raise HTTPException(500, "Razorpay client not configured")
        
    today = date.today()
    
    # Check existing pending payment to be idempotent
    existing = await db.execute(
        select(Payment).where(
            Payment.user_id == user.id,
            Payment.payment_date == today,
            Payment.status == PaymentStatus.pending
        )
    )
    existing_payment = existing.scalars().first()
    
    if existing_payment:
        return {
            "order_id": existing_payment.razorpay_order_id,
            "amount": existing_payment.amount,
            "currency": existing_payment.currency,
            "key_id": RAZORPAY_KEY_ID
        }
        
    try:
        order = client.order.create({
            "amount": req.amount,
            "currency": "INR",
            "receipt": f"devthoughts_{user.id}_{today.isoformat()}",
            "notes": {"user_id": str(user.id)}
        })
        
        payment = Payment(
            user_id=user.id,
            razorpay_order_id=order["id"],
            amount=req.amount,
            currency="INR",
            payment_date=today
        )
        db.add(payment)
        await db.commit()
        await db.refresh(payment)
        
        return {
            "order_id": order["id"],
            "amount": order["amount"],
            "currency": "INR",
            "key_id": RAZORPAY_KEY_ID
        }
    except Exception as e:
        raise HTTPException(500, f"Error creating Razorpay order: {str(e)}")

@router.post("/verify")
async def verify_payment(
    req: VerifyPaymentRequest,
    db: AsyncSession = Depends(get_session),
    user: User = Depends(get_current_user)
):
    if not client:
        raise HTTPException(500, "Razorpay client not configured")
        
    try:
        client.utility.verify_payment_signature({
            "razorpay_order_id": req.razorpay_order_id,
            "razorpay_payment_id": req.razorpay_payment_id,
            "razorpay_signature": req.razorpay_signature
        })
    except razorpay.errors.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Payment verification failed")
        
    # Mark payment as success
    result = await db.execute(
        select(Payment).where(Payment.razorpay_order_id == req.razorpay_order_id)
    )
    payment = result.scalars().first()
    if payment:
        payment.status = PaymentStatus.success
        payment.razorpay_payment_id = req.razorpay_payment_id
        db.add(payment)
        await db.commit()
        
    # Grant entitlement via Clerk Metadata (requires Clerk Secret)
    try:
        clerk_client.users.update(
            user.clerk_id,
            public_metadata={"last_paid_date": str(date.today())}
        )
    except Exception as e:
        print(f"Failed to update Clerk metadata: {e}")
        # In a real app we'd enqueue a retry task
    
    return {"success": True}
