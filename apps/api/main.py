from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine

from routers import thought, user, payment

app = FastAPI(title="DevThoughts API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, set to NEXT_PUBLIC_APP_URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

app.include_router(thought.router)
app.include_router(user.router)
app.include_router(payment.router)

