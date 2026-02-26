from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
from datetime import datetime, date
from enum import Enum
import uuid

class ContentType(str, Enum):
    text = "text"
    image = "image"

class PaymentStatus(str, Enum):
    pending = "pending"
    success = "success"
    failed = "failed"

# ─── Users ────────────────────────────────────────────────────────────────────

class UserBase(SQLModel):
    clerk_id: str = Field(unique=True, index=True)
    name: str
    email: str = Field(unique=True, index=True)
    profile_image_url: Optional[str] = None
    is_blocked: bool = Field(default=False)

class User(UserBase, table=True):
    __tablename__ = "users"

    id: Optional[uuid.UUID] = Field(
        default_factory=uuid.uuid4, primary_key=True
    )
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    thoughts: list["Thought"] = Relationship(back_populates="author")
    payments: list["Payment"] = Relationship(back_populates="user")

# ─── Thoughts ─────────────────────────────────────────────────────────────────

class ThoughtBase(SQLModel):
    content_type: ContentType
    content: str  # text content OR Supabase/S3 image URL
    post_date: date = Field(index=True)

class Thought(ThoughtBase, table=True):
    __tablename__ = "thoughts"

    id: Optional[uuid.UUID] = Field(
        default_factory=uuid.uuid4, primary_key=True
    )
    author_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: datetime  # created_at + 24 hours
    is_removed: bool = Field(default=False)  # admin flag
    is_active: bool = Field(default=True)

    author: Optional[User] = Relationship(back_populates="thoughts")

# ─── Payments ─────────────────────────────────────────────────────────────────

class PaymentBase(SQLModel):
    razorpay_order_id: str = Field(unique=True, index=True)
    razorpay_payment_id: Optional[str] = Field(default=None, index=True)
    amount: int  # in paise (₹10 = 1000, ₹20 = 2000, ₹50 = 5000)
    currency: str = Field(default="INR")
    status: PaymentStatus = Field(default=PaymentStatus.pending)
    payment_date: date = Field(index=True)

class Payment(PaymentBase, table=True):
    __tablename__ = "payments"

    id: Optional[uuid.UUID] = Field(
        default_factory=uuid.uuid4, primary_key=True
    )
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    verified_at: Optional[datetime] = None

    user: Optional[User] = Relationship(back_populates="payments")

# ─── Admin Logs ───────────────────────────────────────────────────────────────

class AdminLog(SQLModel, table=True):
    __tablename__ = "admin_logs"

    id: Optional[uuid.UUID] = Field(
        default_factory=uuid.uuid4, primary_key=True
    )
    admin_clerk_id: str
    action: str  # "remove_thought" | "block_user" | "override_thought"
    target_id: Optional[str] = None  # thought_id or user_id
    reason: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
