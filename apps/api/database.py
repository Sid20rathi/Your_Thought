import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# We'll use sqlite for local dev if DATABASE_URL is not set, otherwise postgres
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./devthoughts.db")

engine = create_async_engine(DATABASE_URL, echo=True, future=True)

async def get_session() -> AsyncSession:
    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    async with async_session() as session:
        yield session
