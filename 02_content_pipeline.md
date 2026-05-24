# RS-02: Content Pipeline — Roblox Dev Diary

> **Paperclip:** EMI-19 | Status: in_progress  
> **Project:** Roblox School | **Owner:** EMILY.Co  
> **Doc:** `roblox-school/02_content_pipeline.md`

---

## Pipeline Overview

```
IDEA → OUTLINE → DRAFT → REVIEW → PUBLISH → DISTRIBUTE
  │        │        │       │        │          │
  │     Weekly    Self   P'Jo    Schedule    Share on
  │    Planning  edit   approve             social/R社区
```

---

## 1. Idea Generation

**Sources of ideas:**
- Devlog: สิ่งที่ทำใน project จริงวันนี้/สัปดาห์นี้
- Tutorial: สิ่งที่น่าจะมีคนถาม / skill ที่ผ่านมาประจำ
- Quick Tip: การค้นพบเล็กๆ ที่ทำให้ชีวิตดีขึ้น

**Idea backlog:**
- ใช้ Notion page หรือ Obsidian note เก็บ idea ที่ยังไม่ได้เขียน
- Label: `#devlog`, `#tutorial`, `#tip`, `#backlog`
- ดึง idea มาจาก devlog จริงที่ทำอยู่แล้ว (don't force topics)

---

## 2. Weekly Planning (Every Sunday)

**Checklist:**
- [ ] Review idea backlog
- [ ] Pick 1 devlog + 1 tip/tutoria สำหรับสัปดาห์หน้า
- [ ] Assign publication date
- [ ] Update content calendar (ใน `01_content_plan.md`)

**Time needed:** ~15-20 นาที

---

## 3. Writing Process

### Step A: Outline (10-15 นาที)
```
## สรุปสัปดาห์นี้ (TL;DR)
## 🔧 ทำอะไร
## 🎯 สิ่งที่ได้เรียนรู้
## 🤔 ปัญหาที่เจอ + วิธีแก้
## 📅 สัปดาห์หน้าจะทำอะไร
```

### Step B: Draft (30-60 นาที)
- เขียนตาม outline — ไม่ต้อง perfect
- ใส่ code snippets, descriptions ของสิ่งที่ทำ
- Screenshot: ถ่ายรูปหน้าจอตอนทำ / ผลลัพธ์

### Step C: Self-Review (10 นาที)
- อ่านรอบเดียว — แก้ run-on sentences
- ตรวจสอบ: title ชัดเจนมั้ย, TL;DR มีจุดสำคัญครบมั้ย
- ลบ stream-of-consciousness writing

---

## 4. Review & Approval

**Process:**
1. Drafter (AI agent) ส่ง draft link ให้ P'Jo
2. P'Jo review: approve หรือ give feedback
3. Drafter revise ตาม feedback

**What P'Jo checks:**
- ✅ Factual correctness (technical accuracy)
- ✅ Tone เหมาะกับ brand
- ✅ ไม่มีข้อมูลที่ไม่อยากเปิดเผย
- ✅ พร้อม publish

**Feedback format:**
```
[OK to publish] — หรือ —
[Feedback]:
1. ...
2. ...
```

---

## 5. Publication

**Where to publish:**
- **Primary:** Blog / website (เช่น Notion public page, Ghost, หรือ static site)
- **Cross-post:** Roblox dev community ไทย, medium (optional)

**On-publish checklist:**
- [ ] Add featured image / thumbnail
- [ ] SEO: title, meta description, tags
- [ ] Internal link ไปยัง related posts ก่อนหน้า
- [ ] Publicize: แจ้ง subscribers / post to community

---

## 6. Distribution

**Auto-share targets:**
- Facebook: Thai Game Dev group, Roblox Thailand
- Twitter/X: #RobloxDev, #GameDev
- Discord: Roblox dev communities (ถ้ามี)

**Manual outreach (monthly):**
- แชร์ tutorial ที่มีคุณค่าไปยัง community ที่เกี่ยวข้อง
- ตอบคำถามใน community ที่ตรงกับ expertise

---

## 7. Templates

### Devlog Template
```
# [EP.XX] Title

## สรุปสัปดาห์นี้ (TL;DR)
- ✅ ทำอะไรได้บ้าง
- 📊 ผลลัพธ์สำคัญ

## 🔧 ทำอะไร
[รายละเอียด process — code, screenshots]

## 🎯 สิ่งที่ได้เรียนรู้
[insights จากการทำ]

## 🤔 ปัญหาที่เจอ + วิธีแก้
[honest reflection, what you tried that didn't work]

## 📅 สัปดาห์หน้าจะทำอะไร
[concrete next steps]
```

### Quick Tip Template
```
# 💡 Quick Tip: [Topic]

## TL;DR
[One sentence summary]

## ปัญหา
[What problem this solves]

## วิธีทำ
[Steps — keep it simple]

## Code / Example
[If applicable]
```

---

## 8. Tools & References

- **Writing:** Obsidian (ใน memory-atelier) + Notion for public
- **Assets:** Roblox Studio screenshots,自制 thumbnails
- **Reference:** `01_content_plan.md` (content pillars, SEO keywords)
- **Schedule:** Google Calendar reminder ทุกวันอาทิตย์

---

## 9. Content Pipeline in Practice

**สัปดาห์แรกของ pipeline (ทดสอบ):**

| Day | Task |
|-----|------|
| Sun | Plan: EP1 devlog + Lua tip |
| Mon-Tue | Write EP1 draft |
| Wed | Self-review |
| Thu | Submit to P'Jo |
| Fri | P'Jo review / approve |
| Sat | Publish + distribute |

---

## 10. Pipeline Health Metrics

| Metric | Target | How to measure |
|--------|--------|----------------|
| On-time delivery | 90%+ | ตรงเวลาตาม content calendar |
| Revision rounds | <2 | avg feedback cycles per post |
| P'Jo time/post | <15 min | review time |
| Reuse rate | >50% | ข้อมูลจาก devlog ไป reuse เป็น tip/tutorial |