# RS-03: Content Structure — Roblox Dev Diary

> **Paperclip:** EMI-19 | **Status:** in_progress  
> **Project:** Roblox School | **Owner:** EMILY.Co  
> **Doc:** `roblox-school/03_content_structure.md`

---

## Purpose

เอกสารนี้กำหนด **โครงสร้างระยะยาว** ของ content ทั้งหมด — ว่ามี series อะไรบ้าง, แต่ละ series เกี่ยวข้องกันยังไง, และ content ที่วางไว้ในแต่ละ phase

---

## 1. Content Architecture

```
Roblox Dev Diary (แบรนด์หลัก)
│
├── 🎬 Devlog Series (40%)
│   ├── EP1: แนะนำโปรเจค ✅
│   ├── EP2: Core Loop Design
│   ├── EP3: ระบบตัวละคร + Animation
│   ├── EP4: Inventory System (ครั้งแรก)
│   ├── EP5: Map Design
│   └── ... (ต่อเนื่องตาม project)
│
├── 💡 Quick Tips Series (35%)
│   ├── Tip01: Lua Basics ✅
│   ├── Tip02: RemoteEvents
│   ├── Tip03: State Machine
│   ├── Tip04: DataStore 101
│   └── ... (ทำทีละ concept)
│
└── 📚 Tutorial Series (25%)
    ├── Tut01: State Machine สำหรับ NPC
    ├── Tut02: DataStore — Save/Load ข้อมูล
    ├── Tut03: Proximity Trigger Dialog
    └── Tut04: RPG Stats System (ตั้งแต่ต้น)
```

---

## 2. Content Dependencies (เส้นเรื่อง)

```
EP1 (Intro)           → ปูพื้นฐานทุกอย่าง
   │
   ├── Tip01 (Lua)    → พื้นฐานที่ EP1 สอนใช้ใน Tip01
   │
   ├── EP2 (Core Loop)
   │      │
   │      ├── Tip02 (RemoteEvents) → EP2 ใช้ระบบ event
   │      │
   │      └── EP3 (Character/Animation)
   │             │
   │             └── Tut01 (State Machine) → NPC behavior ที่ใช้ใน EP3
   │
   ├── EP4 (Inventory)
   │      │
   │      └── Tip03 (RemoteEvents) → ปูพื้นก่อน EP4
   │
   └── Tut02 (DataStore) → ของที่ EP4 ใช้เก็บข้อมูล
```

**หลักการ:** Devlog เป็นแกนหลัก — Tutorial และ Tip ออกมาจากสิ่งที่ devlog ทำจริง

---

## 3. Phase Plan

### Phase 1: Foundation (เดือน 1) — EP1-4 + Tips 1-3

| สัปดาห์ | Devlog | Tip/Tutorial |
|---------|--------|-------------|
| 1 | EP1: แนะนำโปรเจค ✅ | Tip01: Lua Basics ✅ |
| 2 | EP2: Core Loop Design | Tut01: State Machine |
| 3 | — (พัก) | Tip02: RemoteEvents |
| 4 | EP3: Character + Animation | Tut02: DataStore |

**เป้า:** 4 devlogs + 3 tips + 2 tutorials = 9 pieces

---

### Phase 2: Depth (เดือน 2-3) — เจาะลึกระบบ

| Series | Topics |
|--------|--------|
| Devlogs | EP5-8: Map design, progression system, combat, UI |
| Tips | Tip04: DataStore advanced, Tip05: Tweening, Tip06: Remote events advanced |
| Tutorials | Tut03: Proximity Dialog, Tut04: RPG Stats System |

**เป้า:** 4 devlogs + 3 tips + 2 tutorials/เดือน

---

### Phase 3: Portfolio (เดือน 4+) — สร้าง authority

- เปลี่ยน devlog เป็น "case study" ที่ลงลึก
- รวบรวมเป็น "Complete Guide" ที่ช่วยคนอื่น
- Cross-post ไป DevForum

---

## 4. Content Template Library

### Devlog Template
```
# [EP.XX] Title

## TL;DR (2-4 bullet points)
## 🔧 ทำอะไร (process + screenshots/code)
## 🎯 สิ่งที่ได้เรียนรู้ (insights)
## 🤔 ปัญหาที่เจอ + วิธีแก้ (honest reflection)
## 📅 สัปดาห์หน้าจะทำอะไร (concrete next steps)
## 📚 Links (ถ้ามี)
```

### Quick Tip Template
```
# 💡 Quick Tip: [Topic]

## TL;DR (one sentence)
## ปัญหา (what problem this solves)
## วิธีทำ (steps)
## Code / Example (ถ้ามี)
## สรุป (key takeaways)
```

### Tutorial Template
```
# 📚 [Title]

## Overview (TL;DR + prerequisites)
## ปัญหา (context ว่าทำไมต้องทำสิ่งนี้)
## วิธีทำ (step-by-step)
## Code (full working example)
## ข้อควรระวัง / Pitfalls
## แชร์ต่อ (ถ้ามี)
```

---

## 5. Content Status Tracker

### Devlog Series

| EP | Title | Status | Published |
|----|-------|--------|-----------|
| 01 | แนะนำโปรเจค | Draft ✅ | — |
| 02 | Core Loop Design | pending | — |
| 03 | ระบบตัวละคร + Animation | pending | — |
| 04 | Inventory System | pending | — |
| 05 | Map Design | pending | — |
| 06 | Progression System | pending | — |
| 07 | Combat System | pending | — |
| 08 | UI / HUD | pending | — |

### Quick Tips

| # | Title | Status | Published |
|---|-------|--------|-----------|
| 01 | Lua Basics | Draft ✅ | — |
| 02 | RemoteEvents | pending | — |
| 03 | State Machine | pending | — |
| 04 | DataStore 101 | pending | — |
| 05 | Tweening | pending | — |
| 06 | Advanced RemoteEvents | pending | — |

### Tutorials

| # | Title | Status | Published |
|---|-------|--------|-----------|
| 01 | State Machine สำหรับ NPC | pending | — |
| 02 | DataStore — Save/Load | pending | — |
| 03 | Proximity Trigger Dialog | pending | — |
| 04 | RPG Stats System | pending | — |

---

## 6. Cross-Posting Map

```
Original Content
     │
     ├── Twitter/X      → Snippet (280 chars) + link
     ├── DevForum       → Full post (EN)
     ├── Facebook Group → Link + summary
     └── Medium (optional) → Full post (ถ้ามีเวลา)
```

---

## 7. Content Quality Checklist

**ทุก content ต้องผ่านก่อน publish:**

- [ ] Title ชัดเจน สื่อถึงประโยชน์
- [ ] TL;DR มีจุดสำคัญครบ
- [ ] มี code ตัวอย่างที่ copy-paste ใช้ได้จริง
- [ ] มี screenshot/asset ประกอบ (ถ้ามี)
- [ ] อ่านรอบเดียวแล้วไม่มี run-on sentences
- [ ] ลิงก์ไป related content อื่น
- [ ] ไม่มีข้อมูลที่ P'Jo ไม่อยากเปิดเผย

---

## 8. Content Flow (Reader Journey)

```
ใหม่ → อ่าน EP1 (รู้จักโปรเจค)
     → อ่าน Tip01 (เข้าใจ Lua)
     → ลองทำตาม → ติดใจ
     → อ่าน Tut01 (State Machine — ลงลึก)
     → ติดตาม EP ต่อไป
     → แชร์ต่อ (ถ้าดีจริง)
```

**เป้า:** คนอ่าน 1 post แล้วอยากอ่านต่อ — ไม่ใช่แค่ traffic ที่มาหาย

---

## 9. Content Backlog (Ideas)

### Devlogs
- [ ] EP2: Core Loop — คิดยังไง
- [ ] EP3: Character System + Animation Pipeline
- [ ] EP4: Inventory (ครั้งแรก + สิ่งที่ผิดพลาด)
- [ ] EP5: Map Layout (แรก)
- [ ] EP6: Progression / Level System
- [ ] EP7: Combat Prototype
- [ ] EP8: UI Design

### Tips
- [ ] RemoteEvents — client ↔ server communication
- [ ] State Machine สำหรับ NPC
- [ ] DataStore — save/load player data
- [ ] Tweening — smooth animations
- [ ] Proximity trigger — dialog system

### Tutorials
- [ ] สร้าง State Machine สำหรับ NPC
- [ ] DataStore 101 — save/load ข้อมูล
- [ ] Proximity trigger dialog system
- [ ] RPG stats system ตั้งแต่ต้น

---

*Last updated: 2026-05-21*
*Next: Review 03 → proceed to Phase 1 execution*