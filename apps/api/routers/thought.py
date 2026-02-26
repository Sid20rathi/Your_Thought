from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select
from datetime import date, datetime, timedelta
import json

from database import get_session
from models import Thought, ContentType, User
from dependencies import get_current_user
from services.cache_service import cache
from sqlalchemy import text

router = APIRouter(prefix="/api/thought", tags=["Thought"])

@router.get("/today")
async def get_today_thought(db: AsyncSession = Depends(get_session)):
    today = date.today()
    
    # Try cache first
    cached = await cache.get(f"thought:today:{today.isoformat()}")
    if cached:
        return json.loads(cached)
        
    # Get from DB
    result = await db.execute(
        select(Thought).where(
            Thought.post_date == today,
            Thought.is_active == True,
            Thought.is_removed == False
        )
    )
    thought = result.scalars().first()
    
    if not thought:
        return None
        
    response = {
        "id": str(thought.id),
        "content_type": thought.content_type.value,
        "content": thought.content,
        "post_date": thought.post_date.isoformat(),
        "expires_at": thought.expires_at.isoformat()
    }
    
    await cache.setex(f"thought:today:{today.isoformat()}", 3600, json.dumps(response))
    return response

@router.post("")
async def post_today_thought(
    content_type: ContentType,
    content: str,
    db: AsyncSession = Depends(get_session),
    user: User = Depends(get_current_user)
):
    today = date.today()
    
    # Needs SQLite advisory lock alternative or PG specific. Using a simple check for SQLite.
    try:
        await db.execute(text("SELECT pg_advisory_xact_lock(12345)"))
    except:
        pass # Ignore if not postgres
    
    existing = await db.execute(
        select(Thought).where(
            Thought.post_date == today,
            Thought.is_active == True,
            Thought.is_removed == False
        )
    )
    if existing.scalars().first():
        raise HTTPException(status_code=409, detail="Today's thought has already been posted")
        
    thought = Thought(
        content_type=content_type,
        content=content,
        author_id=user.id,
        post_date=today,
        expires_at=datetime.utcnow() + timedelta(hours=24)
    )
    db.add(thought)
    await db.commit()
    await db.refresh(thought)
    
    await cache.delete(f"thought:today:{today.isoformat()}")
    
    return thought
