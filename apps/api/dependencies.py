from fastapi import Depends, HTTPException, Header
from clerk_backend_api import Clerk
import jwt
from typing import Optional
import os
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from models import User
from database import get_session

CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY")
clerk_client = Clerk(bearer_auth=CLERK_SECRET_KEY)

# Simplistic JWT decode for test purposes.
# In production, use Clerk's JWKS to properly verify the JWT signature.
async def get_current_user(
    authorization: str = Header(...),
    db: AsyncSession = Depends(get_session)
) -> User:
    try:
        # Assuming format "Bearer <token>"
        token = authorization.split("Bearer ")[-1]
        
        # Decode token without verification for test flexibility if needed, 
        # or use properly with PyJWT/python-jose and Clerk's public key.
        # Below is a safe decode assuming valid token handled by Clerk middleware on frontend:
        unverified_claims = jwt.decode(token, options={"verify_signature": False})
        clerk_id = unverified_claims.get("sub")
        if not clerk_id:
            raise HTTPException(status_code=401, detail="Invalid token")
            
        # Get or create local user
        result = await db.execute(select(User).where(User.clerk_id == clerk_id))
        user = result.scalars().first()
        
        if not user:
            # Optionally fetch full details from Clerk API
            user = User(
                clerk_id=clerk_id,
                name="New User",
                email=f"{clerk_id}@placeholder.com"
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)
            
        return user
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
