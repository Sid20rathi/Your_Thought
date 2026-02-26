# DevThoughts — Enhanced Project Prompt (Production-Ready)

> **Working Title:** DevThoughts  
> **Tagline:** *One thought. One day. One community.*  
> A beautifully minimal platform where developers share — and pay to own — the global Thought of the Day.

---

## 🧭 Vision & Core Concept

DevThoughts is a single-purpose micro-platform built for the developer community. Every day, one thought — a quote, meme, hot take, or code snippet — is displayed globally. Anyone can view it. Only authenticated, paying developers can claim and post it.

The product is defined by **radical simplicity** and **opinionated design** — inspired by the editorial minimalism of [Sarvam AI](https://www.sarvam.ai/), the tactile brutalist energy of [Ribbit.dk](https://ribbit.dk/), and the developer-forward dark aesthetic of [Aura Devs](https://auradevs.co/).

---

## 🎨 Design Philosophy & UI Direction

### Visual Inspiration

| Site | What to Borrow |
|---|---|
| [sarvam.ai](https://www.sarvam.ai/) | Hero typography, generous whitespace, monochrome product focus, confident copy |
| [ribbit.dk](https://ribbit.dk/) | Tactile card interactions, bold grid layout, playful-yet-precise hover states |
| [auradevs.co](https://auradevs.co/) | Dark-first developer aesthetic, glowing accent system, code-flavored UI tokens |

### Design System Rules

- **Dark mode default** — background `#0A0A0A` or near-black. No pure white pages.
- **Typography** — `Geist Mono` or `JetBrains Mono` for hero/thought text. `Inter` for UI copy.
- **Accent system** — single neon accent (e.g. `#7C3AED` violet or `#22D3EE` cyan). Used sparingly: CTAs, borders, glows.
- **No rounded corners overload** — sharp or very subtly rounded (`rounded-sm`). Brutalist grid energy.
- **Motion** — subtle entrance animations only. No looping effects. Framer Motion for micro-interactions.
- **Spacing** — generous padding. Let the thought breathe.
- **Cards** — thin 1px borders with low-opacity backgrounds. Glassmorphism used minimally.

### Stitch MCP Server (Antigravity Design Workflow)

For UI component prototyping and design iteration, this project uses the **Stitch MCP Server** inside Antigravity:

```
Use the Stitch MCP tool to:
- Generate and iterate on UI components using natural language
- Prototype dark-mode card, hero, and dashboard layouts
- Export Tailwind-compatible component trees
- Validate contrast ratios and accessibility in dark themes
- Rapidly test typographic hierarchy for the Thought display card
```

**Workflow:**
1. Describe component intent in Antigravity chat
2. Stitch MCP generates component scaffold
3. Export to Next.js `/components` with Tailwind classes
4. Refine manually with project design tokens

---

## 👥 Target Users

| Role | Capabilities |
|---|---|
| **Anonymous Visitor** | View today's thought, author, date. Read-only. |
| **Registered Developer** | Sign in via Clerk (Google/GitHub OAuth). Access dashboard. Pay to post. |
| **Admin** | Override/delete thoughts. Block users. View audit logs. (Future-ready) |

---

## 🔐 Authentication — Clerk

**All authentication and user billing is handled exclusively by [Clerk](https://clerk.dev/).**

### Why Clerk

- Handles OAuth (Google, GitHub) out of the box
- Built-in user management dashboard
- Organizations support (future admin roles)
- Webhook events for `user.created`, `user.updated`
- Works natively with Next.js App Router middleware

### Clerk Setup

```bash
npm install @clerk/nextjs
```

**Environment Variables:**
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

**Middleware (`middleware.ts`):**
```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
```

### User Data Sync

On `user.created` webhook from Clerk → upsert into local `users` table via `/api/webhooks/clerk`.

**Store locally:**
- `clerk_id` (primary reference)
- `name`, `email`, `profile_image_url`
- `created_at`

---

## 💳 Billing — Clerk Billing + Razorpay

### Billing Architecture

Clerk handles **subscription/entitlement state** (has the user paid today?).
Razorpay handles the **actual payment transaction** in INR.

**Flow:**
```
User clicks "Post Today's Thought"
  → Check Clerk session (authenticated?)
  → Check today's post status (already claimed?)
  → Check user's daily payment entitlement (paid today?)
  → If not paid: initiate Razorpay order
  → On payment success: verify webhook → grant daily entitlement via Clerk metadata
  → Unlock post editor
```

### Clerk Metadata for Entitlement

After successful payment, store in Clerk `privateMetadata`:
```json
{
  "last_paid_date": "2025-01-15",
  "total_payments": 3
}
```

Check entitlement server-side:
```typescript
import { currentUser } from '@clerk/nextjs/server';

const user = await currentUser();
const lastPaid = user?.privateMetadata?.last_paid_date;
const today = new Date().toISOString().split('T')[0];
const hasPaidToday = lastPaid === today;
```

---

## 🗄️ Database Schema — PostgreSQL + SQLModel

**ORM: [SQLModel](https://sqlmodel.tiangolo.com/)** (FastAPI-native, Pydantic-compatible, type-safe)

### Why SQLModel

- Combines SQLAlchemy + Pydantic in one model definition
- Full type safety end-to-end
- Works with Alembic for migrations
- Ideal for FastAPI backend

### Models

```python
# models.py
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
```

### Database Indexes (raw SQL for Alembic)

```sql
-- Enforce one active thought per day
CREATE UNIQUE INDEX idx_one_thought_per_day
  ON thoughts (post_date)
  WHERE is_removed = FALSE AND is_active = TRUE;

-- Enforce one successful payment per user per day
CREATE UNIQUE INDEX idx_one_payment_per_user_per_day
  ON payments (user_id, payment_date)
  WHERE status = 'success';

-- Fast today's thought lookups
CREATE INDEX idx_thoughts_post_date ON thoughts (post_date);
CREATE INDEX idx_thoughts_active ON thoughts (is_active, is_removed);
```

---

## 🏗️ Tech Stack

### Frontend
| Layer | Choice | Reason |
|---|---|---|
| Framework | **Next.js 14 (App Router)** | RSC, ISR, edge-ready |
| Language | **TypeScript** | End-to-end type safety |
| Styling | **Tailwind CSS v3** | Utility-first, fast iteration |
| Animations | **Framer Motion** | Micro-interactions |
| Auth UI | **Clerk (`@clerk/nextjs`)** | Drop-in, zero-config |
| State | **Zustand** | Minimal global state |
| Forms | **React Hook Form + Zod** | Validated forms |

### Backend
| Layer | Choice | Reason |
|---|---|---|
| Framework | **FastAPI** | Async, typed, auto-docs |
| ORM | **SQLModel** | Pydantic + SQLAlchemy unified |
| Migrations | **Alembic** | Schema versioning |
| DB | **PostgreSQL** | ACID, indexing, concurrent safety |
| Cache | **Redis (Upstash)** | Today's thought cache layer |
| Queue | **Inngest** (optional) | Thought expiry events |

> **Justification for FastAPI over Next.js API routes:** Payment webhook verification, database transactions with advisory locks for concurrent posting safety, and background job scheduling (thought expiry) are cleaner in a dedicated async Python service. Next.js handles all UI/SSR; FastAPI handles all business logic.

### Infrastructure
| Service | Provider |
|---|---|
| Auth + Billing state | **Clerk** |
| Payments | **Razorpay** |
| Image Storage | **Supabase Storage** (or AWS S3) |
| Database | **Supabase PostgreSQL** (or Railway) |
| Cache | **Upstash Redis** |
| Frontend deploy | **Vercel** |
| Backend deploy | **Railway** or **Render** |

---

## 📁 Project Structure

```
devthoughts/
├── apps/
│   ├── web/                          # Next.js frontend
│   │   ├── app/
│   │   │   ├── (public)/
│   │   │   │   ├── page.tsx          # Landing page
│   │   │   │   └── layout.tsx
│   │   │   ├── (auth)/
│   │   │   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   │   │   └── sign-up/[[...sign-up]]/page.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   └── api/
│   │   │       └── webhooks/
│   │   │           └── clerk/route.ts
│   │   ├── components/
│   │   │   ├── thought/
│   │   │   │   ├── ThoughtCard.tsx
│   │   │   │   ├── ThoughtEditor.tsx
│   │   │   │   └── DefaultThought.tsx
│   │   │   ├── payment/
│   │   │   │   └── PaymentModal.tsx
│   │   │   └── ui/                   # shadcn/ui components
│   │   ├── lib/
│   │   │   ├── api.ts                # Typed API client
│   │   │   └── utils.ts
│   │   └── middleware.ts             # Clerk middleware
│   │
│   └── api/                          # FastAPI backend
│       ├── main.py
│       ├── routers/
│       │   ├── thought.py
│       │   ├── payment.py
│       │   └── user.py
│       ├── services/
│       │   ├── thought_service.py
│       │   ├── payment_service.py
│       │   └── cache_service.py
│       ├── models.py                 # SQLModel tables
│       ├── schemas.py                # Pydantic request/response
│       ├── database.py               # Engine + session
│       ├── dependencies.py           # Auth middleware (Clerk JWT)
│       └── config.py                 # Settings via pydantic-settings
│
├── alembic/                          # DB migrations
├── tests/
│   ├── test_thought.py
│   ├── test_payment.py
│   └── test_auth.py
└── docs/
    ├── README.md
    ├── API.md
    └── DEPLOYMENT.md
```

---

## 🔌 API Design

All backend routes served from FastAPI. Authenticated endpoints validate Clerk JWT via `Authorization: Bearer <token>`.

### Clerk JWT Verification (FastAPI dependency)

```python
# dependencies.py
from fastapi import Depends, HTTPException, Header
from clerk_backend_api import Clerk
import jwt

clerk_client = Clerk(bearer_auth=settings.CLERK_SECRET_KEY)

async def get_current_user(authorization: str = Header(...)) -> User:
    token = authorization.split("Bearer ")[-1]
    try:
        # Verify with Clerk's JWKS
        payload = verify_clerk_token(token)
        clerk_id = payload["sub"]
        user = await get_or_create_user(clerk_id)
        return user
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
```

### Endpoints

```
GET    /api/thought/today           → Public. Returns today's thought (cached in Redis).
POST   /api/thought                 → Protected. Post today's thought after payment.

POST   /api/payment/create          → Protected. Create Razorpay order.
POST   /api/payment/verify          → Protected. Verify payment signature + grant entitlement.
POST   /api/webhooks/razorpay       → Razorpay webhook (server-to-server, HMAC verified).

GET    /api/user/me                 → Protected. Return user profile + posting status.

POST   /api/admin/thought/remove    → Admin only. Soft-delete a thought.
POST   /api/admin/user/block        → Admin only. Block a user.
GET    /api/admin/logs              → Admin only. View audit log.
```

### Response Schemas

```python
# schemas.py

class ThoughtResponse(BaseModel):
    id: str
    content_type: ContentType
    content: str
    author_name: str
    author_image: Optional[str]
    post_date: date
    expires_at: datetime

class TodayStatusResponse(BaseModel):
    has_thought: bool
    thought: Optional[ThoughtResponse]
    can_post: bool           # False if thought already exists
    has_paid_today: bool     # From Clerk metadata
    
class PaymentOrderResponse(BaseModel):
    order_id: str
    amount: int
    currency: str
    key_id: str              # Razorpay public key (safe to expose)
```

---

## 💰 Payment Flow — Razorpay

### Create Order

```python
# payment_service.py
import razorpay

client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

async def create_order(user_id: uuid.UUID, amount_paise: int) -> dict:
    # Idempotency: check if pending order exists for today
    existing = await get_pending_payment_today(user_id)
    if existing:
        return {"order_id": existing.razorpay_order_id, "amount": existing.amount}

    order = client.order.create({
        "amount": amount_paise,
        "currency": "INR",
        "receipt": f"devthoughts_{user_id}_{date.today().isoformat()}",
        "notes": {"user_id": str(user_id)}
    })
    
    await save_payment_record(user_id, order["id"], amount_paise)
    return order
```

### Verify Payment (HMAC)

```python
async def verify_payment(
    razorpay_order_id: str,
    razorpay_payment_id: str,
    razorpay_signature: str,
    user_id: uuid.UUID
) -> bool:
    try:
        client.utility.verify_payment_signature({
            "razorpay_order_id": razorpay_order_id,
            "razorpay_payment_id": razorpay_payment_id,
            "razorpay_signature": razorpay_signature
        })
    except razorpay.errors.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Payment verification failed")

    # Mark payment as verified in DB
    await mark_payment_success(razorpay_order_id, razorpay_payment_id)
    
    # Grant entitlement via Clerk metadata
    await update_clerk_metadata(user_id, last_paid_date=str(date.today()))
    
    return True
```

### Frontend Payment Trigger

```typescript
// PaymentModal.tsx
declare const Razorpay: any;

const openPayment = async (amount: number) => {
  const { order_id, key_id } = await api.createPaymentOrder(amount);

  const rzp = new Razorpay({
    key: key_id,
    order_id,
    amount,
    currency: 'INR',
    name: 'DevThoughts',
    description: 'Post Today\'s Thought',
    theme: { color: '#7C3AED' },
    handler: async (response: any) => {
      await api.verifyPayment(response);
      router.refresh(); // Re-fetch dashboard state
    },
  });
  rzp.open();
};
```

---

## 📝 Posting Logic — Concurrent Safety

```python
# thought_service.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

async def post_thought(
    db: AsyncSession,
    user: User,
    content_type: ContentType,
    content: str
) -> Thought:
    today = date.today()
    
    # Advisory lock: prevents race condition on concurrent posts
    await db.execute(text("SELECT pg_advisory_xact_lock(12345)"))
    
    # Double-check inside lock
    existing = await db.exec(
        select(Thought).where(
            Thought.post_date == today,
            Thought.is_active == True,
            Thought.is_removed == False
        )
    ).first()
    
    if existing:
        raise HTTPException(409, "Today's thought has already been posted")
    
    thought = Thought(
        content_type=content_type,
        content=content,
        author_id=user.id,
        post_date=today,
        expires_at=datetime.utcnow() + timedelta(hours=24)
    )
    db.add(thought)
    await db.commit()
    
    # Invalidate Redis cache
    await cache.delete("thought:today")
    
    return thought
```

---

## 🏠 Landing Page

### Server Component (Next.js)

```typescript
// app/(public)/page.tsx
import { Suspense } from 'react';
import { ThoughtCard } from '@/components/thought/ThoughtCard';
import { DefaultThought } from '@/components/thought/DefaultThought';

// ISR: revalidate every 60 seconds
export const revalidate = 60;

async function getTodayThought() {
  const res = await fetch(`${process.env.API_URL}/api/thought/today`, {
    next: { revalidate: 60 }
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function HomePage() {
  const thought = await getTodayThought();

  return (
    <main className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6">
      {/* Hero section */}
      <header className="mb-16 text-center">
        <p className="text-[#7C3AED] font-mono text-sm tracking-widest uppercase mb-3">
          devthoughts
        </p>
        <h1 className="text-white font-mono text-2xl font-light tracking-tight">
          One thought. One day. One community.
        </h1>
      </header>

      {/* Today's Thought */}
      <Suspense fallback={<ThoughtSkeleton />}>
        {thought ? (
          <ThoughtCard thought={thought} />
        ) : (
          <DefaultThought />
        )}
      </Suspense>

      {/* CTA */}
      <footer className="mt-16 text-center">
        <p className="text-zinc-500 text-sm font-mono">
          Want to own today?{' '}
          <a href="/dashboard" className="text-[#7C3AED] hover:underline">
            Sign in & post →
          </a>
        </p>
      </footer>
    </main>
  );
}
```

---

## 🎛️ Dashboard

```typescript
// app/dashboard/page.tsx
import { auth, currentUser } from '@clerk/nextjs/server';

export default async function DashboardPage() {
  const { userId } = auth();
  const user = await currentUser();
  
  const [status, me] = await Promise.all([
    api.getTodayStatus(),
    api.getUserMe()
  ]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-8">
      <DashboardHeader user={user} />
      
      {status.has_thought ? (
        <AlreadyPostedBanner thought={status.thought} isOwnPost={status.thought.author_id === me.id} />
      ) : (
        <PostThoughtSection hasPaidToday={status.has_paid_today} />
      )}
    </div>
  );
}
```

---

## 🔒 Security & Validation

### Content Validation

```python
# validators.py
import re
from fastapi import HTTPException

BLOCKED_PATTERNS = [
    r'\b(NSFW|explicit terms)\b',  # expand with real blocklist
]

def validate_thought_content(content: str, content_type: ContentType):
    if content_type == ContentType.text:
        if len(content) > 300:
            raise HTTPException(422, "Text exceeds 300 character limit")
        if len(content.strip()) < 10:
            raise HTTPException(422, "Content too short")
        for pattern in BLOCKED_PATTERNS:
            if re.search(pattern, content, re.IGNORECASE):
                raise HTTPException(422, "Content violates community guidelines")
    
    elif content_type == ContentType.image:
        # URL validation — actual file checked at upload time
        if not content.startswith(("https://", "http://")):
            raise HTTPException(422, "Invalid image URL")
```

### Image Upload (Supabase Storage)

```typescript
// lib/upload.ts
import { createClient } from '@supabase/supabase-js';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export async function uploadMeme(file: File, userId: string): Promise<string> {
  if (file.size > MAX_FILE_SIZE) throw new Error('File exceeds 2MB limit');
  if (!ALLOWED_TYPES.includes(file.type)) throw new Error('Invalid file type');

  const path = `thoughts/${userId}/${Date.now()}.${file.type.split('/')[1]}`;
  const { data, error } = await supabase.storage
    .from('devthoughts')
    .upload(path, file, { contentType: file.type });

  if (error) throw error;
  return supabase.storage.from('devthoughts').getPublicUrl(data.path).data.publicUrl;
}
```

### Rate Limiting

```python
# Using slowapi (FastAPI rate limiter)
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@router.post("/thought")
@limiter.limit("5/minute")
async def post_thought(request: Request, ...):
    ...
```

---

## ⚙️ Environment Variables

```env
# ── Clerk ────────────────────────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# ── Razorpay ─────────────────────────────────────────────
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_...

# ── Database ─────────────────────────────────────────────
DATABASE_URL=postgresql+asyncpg://user:password@host:5432/devthoughts

# ── Redis (Upstash) ──────────────────────────────────────
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# ── Supabase Storage ─────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=...

# ── App ──────────────────────────────────────────────────
API_URL=https://api.devthoughts.dev
NEXT_PUBLIC_APP_URL=https://devthoughts.dev
PAYMENT_AMOUNTS=[1000,2000,5000]   # paise: ₹10, ₹20, ₹50
```

---

## 🧪 Testing Requirements

### Unit Tests (pytest)

```python
# tests/test_thought.py
async def test_only_one_thought_per_day(db_session):
    user1 = await create_test_user(db_session, "user1")
    user2 = await create_test_user(db_session, "user2")
    
    await post_thought(db_session, user1, ContentType.text, "Hello devs!")
    
    with pytest.raises(HTTPException) as exc:
        await post_thought(db_session, user2, ContentType.text, "Me too!")
    
    assert exc.value.status_code == 409

# tests/test_payment.py
async def test_payment_verification_fails_with_bad_signature(client):
    response = await client.post("/api/payment/verify", json={
        "razorpay_order_id": "order_test",
        "razorpay_payment_id": "pay_test",
        "razorpay_signature": "invalid_sig"
    })
    assert response.status_code == 400

async def test_cannot_post_without_payment(client, auth_headers):
    response = await client.post("/api/thought", 
        json={"content_type": "text", "content": "Hi"},
        headers=auth_headers
    )
    assert response.status_code == 403
```

### Manual Testing Checklist

```
[ ] Landing page loads without login
[ ] Default message shown when no thought exists
[ ] Thought card renders text correctly
[ ] Thought card renders image/meme correctly
[ ] Sign in with Google via Clerk
[ ] Sign in with GitHub via Clerk
[ ] Dashboard shows correct today's status
[ ] Cannot post if thought already exists (UI disabled)
[ ] Payment modal opens with correct amount
[ ] Razorpay payment completes in test mode
[ ] Post editor unlocks after payment
[ ] Thought appears on landing page after posting
[ ] Second user cannot post after first posts
[ ] Admin can remove thought
[ ] Admin can block user
[ ] Rate limiting triggers on spam attempts
[ ] ISR cache updates within 60 seconds
[ ] Mobile responsive on 375px, 768px, 1280px
[ ] Dark mode is default, no flash of white
```

---

## 🚀 Build Order (Step-by-Step)

```
Step 1  — Monorepo init (turborepo), install deps, configure TS paths
Step 2  — SQLModel models + Alembic migration (init schema)
Step 3  — FastAPI skeleton: database session, settings, basic health check
Step 4  — Clerk integration: Next.js middleware + webhook user sync
Step 5  — Landing page: public thought display, ISR, Tailwind dark theme
Step 6  — Dashboard: protected route, today's status UI
Step 7  — Stitch MCP (Antigravity): prototype ThoughtCard, PaymentModal, Dashboard components
Step 8  — Razorpay: create order, verify webhook, grant Clerk metadata entitlement
Step 9  — Posting logic: concurrent lock, validation, Supabase image upload
Step 10 — Redis cache: today's thought, invalidate on post
Step 11 — Admin endpoints + admin flag in Clerk user metadata
Step 12 — Security: rate limiting, content validation, file size guards
Step 13 — Tests: unit + integration
Step 14 — Deployment: Vercel (web) + Railway (api) + Supabase (db/storage)
Step 15 — README, API docs, env template
```

---

## 🚢 Deployment

### Vercel (Frontend)

```bash
# vercel.json
{
  "buildCommand": "cd apps/web && next build",
  "outputDirectory": "apps/web/.next",
  "framework": "nextjs",
  "env": { ... }
}
```

### Railway (FastAPI Backend)

```dockerfile
# apps/api/Dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
```

### Supabase

- Enable PostgreSQL
- Enable Storage bucket `devthoughts` (public read, auth write)
- Set RLS policies for storage

---

## 📚 README Template

```markdown
# DevThoughts

> One thought. One day. One community.

A minimal developer platform where one global "Thought of the Day" 
is posted each day by a paying community member.

## Stack
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, Clerk
- **Backend:** FastAPI, SQLModel, PostgreSQL, Redis
- **Payments:** Razorpay (INR)
- **Storage:** Supabase Storage
- **Design tooling:** Stitch MCP (Antigravity)

## Quick Start
\`\`\`bash
git clone https://github.com/yourorg/devthoughts
cp .env.example .env.local   # fill in all variables
npm install && npm run dev    # starts Next.js
cd apps/api && uvicorn main:app --reload   # starts FastAPI
\`\`\`

## API Docs
Run FastAPI locally → visit http://localhost:8000/docs (Swagger auto-generated)
```

---

*Last updated: February 2026 | Architecture version: 1.0*
