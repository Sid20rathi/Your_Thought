from fastapi import APIRouter, Depends
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession
from models import User
from dependencies import get_current_user
from database import get_session
from datetime import date

router = APIRouter(prefix="/api/user", tags=["User"])

@router.get("/me")
async def get_user_me(user: User = Depends(get_current_user)):
    return {
        "id": str(user.id),
        "clerk_id": user.clerk_id,
        "name": user.name,
        "email": user.email,
        "profile_image_url": user.profile_image_url,
        "is_blocked": user.is_blocked
    }
