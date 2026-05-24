# Dark Mode Card Style Guide — Roblox School

## Problem
บน dark background (Twitter/X dark mode, Discord dark theme, หรือ embed บนเว็บสีเข้ม) สี content card อาจจางหรือไม่ contrast พอ — text อาจฟู หรือ border หายไป

## Solution
ใช้ dark mode card style ให้ contrast สูงบน dark backgrounds ทุกแบบ

---

## Color System

| Element       | Dark Mode  | Light Mode |
|---------------|------------|------------|
| Card BG       | `#1e1e26`  | `#ffffff`  |
| Card BG Hover | `#262630`  | `#f9fafb`  |
| Border        | `#2a2a35`  | `#e5e7eb`  |
| Page BG       | `#0f0f12`  | `#f9fafb`  |
| Title         | `#e8e6e3`  | `#111827`  |
| Body text     | `#a0a0a0`  | `#374151`  |
| Muted/meta    | `#6b6b75`  | `#6b7280`  |
| Accent        | `#eab308`  | `#eab308`  |

---

## CSS Implementation

```css
:root {
  /* Dark theme (default) */
  --bg-primary: #0f0f12;
  --bg-secondary: #18181f;
  --bg-card: #1e1e26;
  --bg-card-hover: #262630;
  --text-primary: #e8e6e3;
  --text-secondary: #a0a0a0;
  --text-muted: #6b6b75;
  --accent: #eab308;
  --border: #2a2a35;
}

/* Content card base */
.content-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  transition: 0.2s ease;
}

/* Hover state — lift + glow */
.content-card:hover {
  background: var(--bg-card-hover);
  border-color: var(--accent);
  transform: translateY(-4px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4),
              0 0 0 1px var(--accent);
}
```

---

## Key Design Decisions

1. **Dark background `#0f0f12`** — กันไม่ให้ card "จ้าบน dark background"
2. **Card BG `#1e1e26`** — subtle contrast ต่างจาก page bg
3. **Border `#2a2a35`** — visible แต่ไม่รบกวนบน dark mode
4. **Accent `#eab308` (ไม่เปลี่ยน)** — ยัง contrast ดีทั้ง light และ dark
5. **Text shadow บน thumbnail** — เพิ่ม legibility บน background สีเข้มมาก
6. **Hover lift `translateY(-4px)`** — ให้รู้สึกว่า card "ลอยขึ้นมา"

---

## Dark Mode Checklist

- [x] Card background `#1e1e26` บน dark page bg
- [x] Title text `#e8e6e3` — ขาวสุดบน dark
- [x] Body text `#a0a0a0` — อ่านได้แต่ไม่แย่งสายตา
- [x] Border `#2a2a35` — visible บน dark bg
- [x] Accent yellow `#eab308` — contrast ดีทั้งสองโหมด
- [x] Hover: accent border + glow shadow
- [x] ไม่มี hardcoded สี — ใช้ CSS variables ทั้งหมด

---

## Usage

Card styles ถูก implement ไว้ใน `styles.css` แล้ว — import ตามปกติ:

```html
<link rel="stylesheet" href="styles.css">
```

ไม่ต้องเพิ่ม classพิเศษ — `.content-card` รองรับทั้ง light และ dark mode ผ่าน CSS variables
