import redis.asyncio as redis
import os

UPSTASH_REDIS_REST_URL = os.getenv("UPSTASH_REDIS_REST_URL")
UPSTASH_REDIS_REST_TOKEN = os.getenv("UPSTASH_REDIS_REST_TOKEN")

# Simple mock for cache if env vars are missing
cache = redis.Redis(
    host=UPSTASH_REDIS_REST_URL.replace("https://", "") if UPSTASH_REDIS_REST_URL else "localhost",
    port=6379,
    password=UPSTASH_REDIS_REST_TOKEN,
    ssl=bool(UPSTASH_REDIS_REST_URL),
    decode_responses=True
)
