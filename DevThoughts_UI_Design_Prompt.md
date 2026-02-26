# DevThoughts — Detailed UI Design Prompt

> This is the complete visual and interaction design specification for DevThoughts.
> Use Stitch MCP in Antigravity to prototype each section before writing final code.
> Every detail below is intentional. Follow it precisely.

---

## 🎨 Global Design System

### Color Palette

```css
/* Base */
--bg-void:        #050505;   /* page background — deeper than black */
--bg-surface:     #0D0D0D;   /* card backgrounds */
--bg-elevated:    #141414;   /* modals, dropdowns, hover states */
--bg-subtle:      #1A1A1A;   /* input fields, code blocks */

/* Borders */
--border-dim:     rgba(255,255,255,0.04);
--border-default: rgba(255,255,255,0.08);
--border-bright:  rgba(255,255,255,0.15);

/* Accent — Violet (primary) */
--accent:         #7C3AED;
--accent-light:   #9D65FF;
--accent-glow:    rgba(124, 58, 237, 0.25);
--accent-subtle:  rgba(124, 58, 237, 0.08);

/* Accent — Cyan (secondary, code/mono flavored) */
--cyan:           #22D3EE;
--cyan-glow:      rgba(34, 211, 238, 0.2);
--cyan-subtle:    rgba(34, 211, 238, 0.06);

/* Text */
--text-primary:   #F4F4F5;
--text-secondary: #A1A1AA;
--text-muted:     #52525B;
--text-ghost:     #27272A;

/* Status */
--green:          #22C55E;
--red:            #EF4444;
--yellow:         #F59E0B;
```

### Typography

```css
/* Install both via Google Fonts or next/font */
--font-mono: 'JetBrains Mono', monospace;   /* thought text, code, labels, logo */
--font-ui:   'Inter', sans-serif;           /* body copy, buttons, nav */

/* Scale */
--text-hero:   clamp(2.5rem, 6vw, 5rem);   /* main thought text */
--text-xl:     1.5rem;
--text-lg:     1.125rem;
--text-base:   0.9375rem;
--text-sm:     0.8125rem;
--text-xs:     0.6875rem;
```

### Spacing & Radius

```css
/* Almost no rounded corners — sharp, brutalist energy */
--radius-sm:   4px;
--radius-md:   6px;
--radius-full: 9999px;   /* only for avatar, pill badges */

/* Prefer generous, asymmetric padding */
```

### Noise Texture Overlay

Apply a subtle SVG noise grain over the entire page (opacity 0.03) using a `::before` pseudo or a fixed `<div>` overlay. This gives warmth and tactile depth — critical for the premium dark feel.

```css
.noise-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  pointer-events: none;
  background-image: url("data:image/svg+xml,..."); /* SVG turbulence filter */
  opacity: 0.035;
}
```

---

## 🌐 Landing Page — Full Specification

### Overall Layout

```
┌─────────────────────────────────────────────────────────┐
│  NAVBAR (fixed, blur backdrop)                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  AMBIENT GLOW (background)                              │
│                                                         │
│  HERO SECTION                                           │
│    — eyebrow label                                      │
│    — headline                                           │
│    — subline                                            │
│    — date badge                                         │
│                                                         │
│  ─────── THOUGHT CARD ───────                           │
│   (the main attraction — centered, glowing)             │
│  ──────────────────────────────                         │
│                                                         │
│  AUTHOR STRIP                                           │
│                                                         │
│  CTA STRIP                                              │
│                                                         │
│  HOW IT WORKS (3-step)                                  │
│                                                         │
│  TICKER / MARQUEE (past thoughts)                       │
│                                                         │
│  FOOTER                                                 │
└─────────────────────────────────────────────────────────┘
```

---

### 1. Navbar

**Behavior:** Fixed top. Starts fully transparent. On scroll > 40px → `backdrop-blur-xl bg-[#050505]/80 border-b border-white/5` transition (300ms ease).

**Layout:** Logo left · Nav links center · Auth button right.

**Logo:**
```
[ dt ] devthoughts
```
- `dt` in a sharp 1px bordered box, `bg-accent-subtle`, color `--accent-light`, font-mono
- `devthoughts` in font-mono, text-sm, text-white/70
- Subtle `glow` on hover: `box-shadow: 0 0 12px var(--accent-glow)`

**Nav links:** `Home` · `How it works` · `Archive` — font-ui, text-sm, text-muted. On hover → text-primary, underline slides in from left (CSS transform, 200ms).

**Auth button (Sign In):**
- Outlined style: `border border-white/10 bg-white/[0.03] text-white/70 px-4 py-1.5 rounded-sm text-sm`
- Hover: `border-accent bg-accent-subtle text-accent-light` (150ms transition)
- If signed in: show Clerk `<UserButton>` with custom dark theme

**Animation:** Navbar fades in from `y: -8` on page load (300ms, 100ms delay).

---

### 2. Ambient Background Glow

Two large radial gradient blobs, absolutely positioned, `pointer-events: none`, `z-index: 0`.

```css
/* Blob 1 — top left, violet */
.blob-violet {
  position: absolute;
  top: -200px;
  left: -100px;
  width: 700px;
  height: 700px;
  background: radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%);
  filter: blur(80px);
  animation: blob-drift 12s ease-in-out infinite alternate;
}

/* Blob 2 — top right, cyan */
.blob-cyan {
  position: absolute;
  top: -100px;
  right: -150px;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 70%);
  filter: blur(100px);
  animation: blob-drift 16s ease-in-out infinite alternate-reverse;
}

@keyframes blob-drift {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(30px, 20px) scale(1.05); }
}
```

---

### 3. Hero Section

**Full-viewport height, flex center.**

#### Eyebrow Label (animate in first)
```
◆ THOUGHT OF THE DAY
```
- Small badge: `border border-accent/30 bg-accent-subtle px-3 py-1 rounded-full`
- Font-mono, text-xs, color `--accent-light`, letter-spacing: 0.15em
- `◆` diamond in `--accent`
- Framer Motion: `initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}` — delay 0s

#### Date line (animate in second)
```
Thursday, 15 January 2025
```
- Font-mono, text-sm, text-muted
- Framer Motion: delay 0.1s

#### Headline (animate in third)
```
What's the dev world 
thinking today?
```
- Font-mono, `var(--text-hero)`, font-weight 400 (NOT bold — elegant, not aggressive)
- Color: text-primary with `background-clip: text` gradient on "thinking today": `linear-gradient(90deg, #F4F4F5 0%, #A78BFA 50%, #22D3EE 100%)`
- Framer Motion: `initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}` — delay 0.15s, duration 0.6s

#### Subline (animate in fourth)
```
One developer claims the spotlight. One thought shapes the day.
```
- Font-ui, text-base, text-secondary, max-width 480px, centered
- Framer Motion: delay 0.25s

---

### 4. The Thought Card (Hero Card — The Star of the Show)

**This is the most important element. Design it like a premium artifact.**

**Container:** `max-width: 720px`, centered, `margin-top: 64px`

**Outer shell:**
```css
.thought-card {
  position: relative;
  background: linear-gradient(135deg, #0D0D0D 0%, #111111 100%);
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 6px;
  padding: 56px 64px;
  
  /* Multi-layer glow */
  box-shadow:
    0 0 0 1px rgba(124,58,237,0.05),
    0 0 40px rgba(124,58,237,0.08),
    0 0 80px rgba(124,58,237,0.04),
    0 32px 64px rgba(0,0,0,0.6);
}
```

**Top accent bar:**
A `2px` tall gradient line at the very top of the card:
```css
.thought-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #7C3AED, #22D3EE, transparent);
  border-radius: 6px 6px 0 0;
}
```

**Corner ornaments (purely decorative SVG):**
Small `+` or `◇` marks in `--accent/20` at top-left and bottom-right corners, absolutely positioned. Gives a "precision instrument" feeling.

**Thought Text:**
- Font-mono, `clamp(1.4rem, 3vw, 2rem)`, font-weight 400
- Color: `#F4F4F5`
- Line-height: 1.6
- Letter-spacing: -0.01em
- Surrounded by large opening `"` quote marks — `color: accent/30`, `font-size: 6rem`, positioned absolutely at top-left

**Framer Motion entry animation:**
```js
initial={{ opacity: 0, y: 24, scale: 0.98 }}
animate={{ opacity: 1, y: 0, scale: 1 }}
transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
```

**If image/meme thought:**
- Image fills the card area with `object-contain`
- Max height: `420px`
- Subtle `2px solid accent/20` border on the image
- Image has a `10px` soft glow: `filter: drop-shadow(0 0 10px rgba(124,58,237,0.15))`

**Footer row inside card:**
```
[Avatar] posted by @username          [date · time ago]
```
- Avatar: `32px` circle with 1px `accent/30` border
- Username: font-mono, text-sm, text-muted
- Date: font-mono, text-xs, text-ghost
- Separator: `flex justify-between items-center mt-8 pt-6 border-t border-white/5`

**Animated text counter (bottom of card):**
For text thoughts, show a subtle character count in bottom-right:
`142 / 300` in font-mono, text-xs, text-ghost

---

### 5. Default State (No Thought Yet)

When no thought has been posted today, show this **instead** of the card — not a broken state, make it feel intentional and atmospheric:

```
[ The spotlight is empty. ]

   ◈

   No thought has been claimed today.
   Be the first developer to own this moment.

   [ → Claim today's thought ]
```

- The `◈` glyph pulses gently: `animation: pulse 3s ease-in-out infinite` (opacity 0.3 → 1 → 0.3)
- A dashed border replaces the solid card border: `border: 1px dashed rgba(124,58,237,0.2)`
- The card background has a very subtle animated gradient shimmer (skeleton-loading style) to show it's "waiting"

---

### 6. Author Strip (below the card)

```
Posted by                    ←   2px gradient line   →              [avatar] devuser.eth
```

Full-width horizontal strip, font-mono, text-sm, text-muted.
Animated: slides up from below with 400ms delay after card appears.

---

### 7. CTA Strip

Appears below the author strip. Only show to non-authenticated or non-paid users.

```
┌─────────────────────────────────────────────────────────────┐
│  Want the spotlight tomorrow?                               │
│  Pay ₹10–₹50 · Post your thought · Own the day             │
│                                                             │
│   [ Sign in with GitHub ]    [ Sign in with Google ]        │
└─────────────────────────────────────────────────────────────┘
```

**Card style:** `bg-elevated border border-white/5 rounded-md p-8`
**Buttons:** 
- GitHub: `bg-white/5 border border-white/10 text-white hover:bg-white/10` with GitHub SVG icon
- Google: same style with Google icon
- Both use `group` hover to slide icon slightly left on hover (translateX -2px)

---

### 8. How It Works Section

3 horizontal steps. On mobile: vertical stack.

```
   [  1  ]              [  2  ]              [  3  ]
  Sign in            Pay ₹10–₹50           Post your
  with GitHub          securely              thought
  or Google           via Razorpay         for the day

  One tap.         Fast & safe.          Your words.
  Zero friction.   INR only.             World's screen.
```

**Step cards:**
- `bg-surface border border-white/5 p-6 rounded-sm`
- Number badge: font-mono, `1px border border-accent/40 bg-accent-subtle text-accent-light w-8 h-8 flex items-center justify-center rounded-sm text-sm`
- Heading: font-mono, text-base, text-primary
- Subtext: font-ui, text-sm, text-secondary

**Connector lines between steps:**
- On desktop: `---→` dashed line between cards in `--accent/20`
- Animated: line "draws" from left to right using `strokeDashoffset` SVG animation on scroll enter

**Scroll animation:** Use Framer Motion `whileInView`:
```js
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, margin: "-50px" }}
transition={{ delay: index * 0.12, duration: 0.5 }}
```

---

### 9. Archive Ticker / Marquee

A horizontally scrolling marquee of past thoughts — infinite loop, auto-playing.

**Layout:**
```
[  past thoughts  scrolling  right  to  left  →  continuously  ]
```

**Each item:**
`"Tabs over spaces. Always." — @devuser1  ·  Jan 14`

- Font-mono, text-sm, text-muted
- Separator: `·` in text-ghost
- Hover on item: text-primary (pause scroll on hover: `animation-play-state: paused`)
- Gradient fade on left and right edges: `mask: linear-gradient(90deg, transparent, black 10%, black 90%, transparent)`

---

### 10. Footer

Minimal. Single row.

```
© 2025 devthoughts          built with ♥ by devs, for devs          GitHub  ·  Twitter
```

- Font-mono, text-xs, text-muted
- `border-t border-white/5 py-8 px-6`
- ♥ in `--accent`

---

## 🎛️ Dashboard Page — Full Specification

### Layout

```
┌─────────────────────────────────────────────────────────┐
│  NAVBAR (same as landing, but shows UserButton)         │
├──────────┬──────────────────────────────────────────────┤
│          │                                              │
│ SIDEBAR  │  MAIN CONTENT AREA                           │
│ (240px)  │                                              │
│          │  — Status Banner                             │
│ — Home   │  — Today's Card (preview or empty)           │
│ — Post   │  — Post Editor (conditional)                 │
│ — Hist.  │  — Payment Modal                             │
│ — Logout │                                              │
│          │                                              │
└──────────┴──────────────────────────────────────────────┘
```

Mobile: sidebar becomes bottom navigation bar.

---

### Sidebar

**Background:** `bg-[#0A0A0A] border-r border-white/5`
**Width:** `240px` fixed on desktop
**Sticky:** full viewport height, `position: sticky top: 0`

**User profile section at top:**
```
┌───────────────────────────────┐
│  [avatar]  John Dev            │
│            john@example.com    │
│  ● Active member               │
└───────────────────────────────┘
```
- Avatar: 40px, `ring-1 ring-accent/30` border
- Name: font-ui, text-sm, text-primary
- Email: font-mono, text-xs, text-muted
- Status dot: animated pulse `bg-green-500` `w-2 h-2 rounded-full` with `animate-pulse`
- Entire section: `bg-elevated border-b border-white/5 p-4 mb-2`

**Nav items:**
```
◈  Overview        ← active state
◇  Post Today
◇  My History
─────────────
◇  Sign Out
```
- Active item: `bg-accent-subtle border-l-2 border-accent text-accent-light`
- Inactive: `text-muted hover:text-primary hover:bg-white/[0.03]`
- Font-mono, text-sm, `px-4 py-2.5 rounded-sm mx-2`
- Icons: simple geometric SVGs (not Lucide — use custom monospace-style glyphs or minimal line icons)
- Hover: smooth `background` transition 150ms

---

### Main Content Area

**Background:** `bg-void`
**Padding:** `p-8` desktop · `p-4` mobile

#### A. Status Banner (Top of content)

Three possible states — each rendered as a distinct banner:

**State 1: Available — No thought posted yet**
```
┌──────────────────────────────────────────────────────────────┐
│  ✦  Today's spotlight is unclaimed.                         │
│     Be the first to post. The day is yours.                  │
│                              [ → Claim Today's Thought ]     │
└──────────────────────────────────────────────────────────────┘
```
- `border border-accent/25 bg-accent-subtle rounded-sm`
- `✦` star glyph in `--accent`
- Button: `bg-accent text-white hover:bg-accent-light px-5 py-2 rounded-sm font-mono text-sm`
- Button has a right-pointing animated arrow: on hover, arrow slides 4px right (translateX)
- **Animated shimmer** on the entire banner border: `@keyframes border-shimmer` rotates a conic gradient

**State 2: Already Posted by Someone Else**
```
┌──────────────────────────────────────────────────────────────┐
│  ✗  Today's thought has been claimed by @devuser42           │
│     Come back tomorrow. The spotlight resets in 14h 22m.     │
└──────────────────────────────────────────────────────────────┘
```
- `border border-white/8 bg-white/[0.02] rounded-sm`
- `✗` in `--text-muted`
- Countdown timer: live, ticking every second via `useEffect` — font-mono, `text-yellow-400`, `tabular-nums`

**State 3: You Already Posted Today**
```
┌──────────────────────────────────────────────────────────────┐
│  ✔  You own today. Your thought is live.                     │
│     [avatar + preview of your thought]                       │
│     It expires in 9h 14m.                                    │
└──────────────────────────────────────────────────────────────┘
```
- `border border-green-500/20 bg-green-500/[0.04] rounded-sm`
- `✔` in `--green`
- Mini thought preview inside banner
- Expiry countdown in `text-green-400` font-mono

---

#### B. Today's Thought Preview Card

Same design as the landing ThoughtCard, but rendered at `max-width: 640px` inside the dashboard content area. Shown in all states — either with actual content or with a "ghost/skeleton" placeholder.

**Skeleton state (when no post yet):**
```css
.skeleton-thought {
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0.02) 25%,
    rgba(255,255,255,0.05) 50%,
    rgba(255,255,255,0.02) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 2s ease-in-out infinite;
}

@keyframes skeleton-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```
Three skeleton lines of varying width (80%, 95%, 60%) to simulate thought text loading.

---

#### C. Post Editor (Unlocked after payment)

Appears below the preview card. **Animate in** with:
```js
initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
```

**Editor header:**
```
[ ✦ You have the floor. Make it count. ]
```
Font-mono, text-sm, text-accent-light. With a subtle `---` separator below.

**Content type toggle:**
```
[ ✎ Text ]   [ ⬡ Image / Meme ]
```
- Pill toggle: active state has `bg-accent-subtle border-accent` with `text-accent-light`
- Inactive: `bg-subtle border-white/8 text-muted`
- Smooth `background-color` transition 200ms on switch

**Text input area (when text selected):**
```
┌─────────────────────────────────────────────────────────┐
│  What's your dev thought for today?                     │
│                                                         │
│  |_                                                     │
│                                                         │
│                                          142 / 300 ▓▓░  │
└─────────────────────────────────────────────────────────┘
```
- `bg-subtle border border-white/8 rounded-sm p-5`
- Font-mono, text-lg, text-primary, `resize: none`
- Focus state: `border-accent/40 shadow-[0_0_0_3px_rgba(124,58,237,0.08)]`
- Character counter: animates color → `text-yellow-400` at 250+, `text-red-400` at 290+
- Progress bar under counter: thin `2px` bar fills left-to-right, color shifts with count

**Image upload area (when image selected):**
```
┌─────────────────────────────────────────────────────────┐
│          ⬆                                              │
│    Drop your meme here or click to browse               │
│    PNG, JPG, GIF, WEBP · max 2MB                        │
└─────────────────────────────────────────────────────────┘
```
- `border-2 border-dashed border-white/10 rounded-sm`
- Drag-over state: `border-accent/50 bg-accent-subtle scale-[1.01]` transition
- After upload: shows image preview with `✕` remove button in corner

**Submit button:**
```
[ → Post Today's Thought ]
```
- Full width, `bg-accent text-white font-mono text-sm py-3 rounded-sm`
- Hover: `bg-accent-light` + `box-shadow: 0 0 20px rgba(124,58,237,0.3)` glow
- Loading state: spinner replaces `→`, button text becomes `Posting...`
- Success state: `bg-green-600`, `✔ Posted!`, then redirects to landing after 1.5s

---

#### D. Payment Modal

Triggered when user clicks "Claim Today's Thought" without having paid.

**Overlay:** `fixed inset-0 bg-black/70 backdrop-blur-sm z-50`
**Modal card:**
```css
.payment-modal {
  background: #0D0D0D;
  border: 1px solid rgba(124, 58, 237, 0.2);
  border-radius: 6px;
  max-width: 440px;
  width: 100%;
  padding: 40px;
  box-shadow: 0 0 80px rgba(124,58,237,0.12);
}
```

**Modal content:**
```
  ◈ devthoughts

  Claim today's spotlight

  Your thought. Displayed globally.
  To every developer who opens devthoughts today.

  ─────────────────────────────────────
  Choose your amount:

    [ ₹10 ]    [ ₹20 ]    [ ₹50 ]
        ↑ selected state highlighted in accent

  ─────────────────────────────────────

       [ Pay ₹10 with Razorpay ]

  🔒 Secured by Razorpay · INR only
```

**Amount selector:**
- 3 buttons in a row
- Selected: `border-accent bg-accent-subtle text-accent-light font-mono`
- Unselected: `border-white/10 bg-white/[0.02] text-muted`
- Click → smooth scale `0.96` on press (active state)

**Pay button:**
- `bg-[#7C3AED]`, full width, font-mono, text-sm
- Animated gradient shimmer on hover: `background-size: 200%` animation slides shine left-to-right
- Below button: `🔒 Secured by Razorpay · INR only` in text-ghost, text-xs

**Modal entrance animation:**
```js
// Overlay: fadeIn 200ms
// Card: scale(0.95) → scale(1) + fadeIn, 300ms, spring easing
initial={{ opacity: 0, scale: 0.95, y: 8 }}
animate={{ opacity: 1, scale: 1, y: 0 }}
transition={{ type: "spring", stiffness: 300, damping: 24 }}
```

---

### E. My History Section (Sidebar nav item)

A table of the user's past posts.

**Empty state:**
```
   ◇

   You haven't posted yet.
   Your thoughts will appear here.
```
- Minimal, centered, `text-muted font-mono text-sm`

**Populated state:**
```
┌────────┬────────────────────────────┬────────────┬──────────┐
│  Date  │  Thought                   │  Type      │  Status  │
├────────┼────────────────────────────┼────────────┼──────────┤
│ Jan 14 │ "Hot take: monorepos..."   │ ◎ Text     │ ✔ Live   │
│ Jan 10 │ [meme thumbnail]           │ ◈ Image    │ ⊘ Expired│
└────────┴────────────────────────────┴────────────┴──────────┘
```
- `bg-surface border border-white/5 rounded-sm`
- Alternating row background: `bg-elevated/0` and `bg-elevated/50`
- Thought text truncated at 40 chars with `...`
- Status badges: `Live` in `text-green-400 bg-green-500/10 border-green-500/20` · `Expired` in `text-zinc-500 bg-zinc-500/10 border-zinc-500/20`

---

## ✨ Micro-Interactions & Animations Reference

| Element | Interaction | Animation |
|---|---|---|
| Navbar | Page scroll | `backdrop-blur` fades in, `300ms ease` |
| Logo | Hover | Violet glow pulses, scale 1.02 |
| ThoughtCard | Page enter | `opacity 0→1, y 24→0, scale 0.98→1`, spring |
| Eyebrow badge | Page enter | `opacity 0→1, y 6→0`, `delay 0s` |
| Headline gradient | Page enter | Gradient slides in left→right via `background-size` |
| How It Works steps | Scroll into view | Staggered `y 20→0, opacity 0→1`, 120ms apart |
| Marquee | Auto-play | CSS `animation: scroll 30s linear infinite` |
| Sidebar nav item | Click | `background` fades in, left border slides in |
| Status banner | Mount | `opacity 0→1, y 8→0`, `300ms ease-out` |
| Post editor | Unlock | `blur(4px)→blur(0), opacity 0→1` (feels like it becomes real) |
| Submit button | Hover | Glow expands outward, arrow nudges right |
| Submit button | Click/Loading | Spinner rotates, text fades to `Posting...` |
| Payment modal | Open | Scale + fade in with spring, overlay fades |
| Amount selector | Select | Border + background transitions 150ms |
| Character counter | 250+ chars | Color transitions to yellow-400 |
| Character counter | 290+ chars | Color transitions to red-400, subtle shake |
| Countdown timer | Live | `tabular-nums` mono font, no layout shift |
| Image drop zone | Drag over | Scale 1.01, border brightens, background tints |
| Skeleton loading | Idle | Shimmer slides right to left continuously |
| Blob glows | Idle | Drift slowly, alternate direction, 12–16s loop |

---

## 📱 Responsive Breakpoints

```
Mobile  (< 640px):  single column, sidebar → bottom tab bar (4 icons), 
                    thought card padding reduced, hero text smaller
Tablet  (640–1024px): sidebar hidden, hamburger menu, card max-width 540px
Desktop (> 1024px):  full sidebar, max-width 720px thought card, generous whitespace
```

---

## 🧩 Component Checklist for Stitch MCP

Use Stitch MCP in this exact order when prototyping:

```
1.  GlobalTokens      — CSS vars, font imports, noise overlay
2.  Navbar            — transparent → blur scroll variant, logo, auth button
3.  AmbientGlow       — violet + cyan blob positioning and drift animation
4.  ThoughtCard       — full card with top bar, quote marks, corner ornaments, author footer
5.  DefaultThought    — empty state with pulsing glyph and dashed border
6.  HeroSection       — eyebrow + headline gradient + subline + date badge layout
7.  CTAStrip          — github + google sign-in buttons
8.  HowItWorks        — 3-step cards with connector animation
9.  ArchiveTicker     — marquee with gradient edge fade
10. DashboardLayout   — sidebar + main content area
11. SidebarNav        — profile section + nav items + active state
12. StatusBanners     — all 3 variants (available / claimed / yours)
13. SkeletonCard      — shimmer skeleton for loading state
14. PostEditor        — type toggle + text area + char counter + image drop
15. PaymentModal      — overlay + card + amount selector + pay button
16. HistoryTable      — table with status badges + empty state
```

---

## ⚡ Final Aesthetic Rules (Non-Negotiable)

1. **Never use pure white (#FFFFFF) as text** — use `#F4F4F5` max
2. **No shadows that glow white** — all glows must use `--accent` or `--cyan` color
3. **The thought card is ALWAYS the biggest, most prominent thing on the page** — nothing competes with it visually
4. **Loading states must feel intentional** — skeleton shimmer, not spinners alone
5. **All interactive elements must have hover AND active (press) states** — scale down 0.97 on active
6. **Typography hierarchy must be obvious** — hero → heading → body → meta. Never flatten it.
7. **Whitespace is content** — use it aggressively. If in doubt, add more padding.
8. **Animations should feel physics-based** — prefer spring easings over linear. Nothing snaps instantly.
9. **Accent color (violet) is precious** — use it on at most 2–3 elements per viewport
10. **Font-mono is the personality** — use it for anything that matters: the thought, labels, the logo, numbers, badges
