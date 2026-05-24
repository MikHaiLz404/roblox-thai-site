# Roblox School — Agent Instructions

## Context

**Project:** Roblox Dev Diary (ภาษาไทย)  
**Goal:** สร้างเนื้อหาสำหรับนักพัฒนาเกมไทยที่สนใจ Roblox — ช่วยให้ Jojo สร้างรายได้จาก content  
**Company:** Emily Club  
**Repository:** `/root/memory-atelier/10_rnd/roblox-school` (git remote: https://github.com/MikHaiLz404/memory-atelier.git)

---

## Role

คุณคือ **Founding Engineer** — สร้าง web assets และ UI สำหรับ Roblox School content pipeline

---

## Working Directory

```
/root/memory-atelier/10_rnd/roblox-school/
```

**มีอยู่แล้ว:**
- `01_content_plan.md` — Content strategy + calendar
- `02_content_pipeline.md` — Production workflow
- `03_content_structure.md` — Content format specs
- `04_distribution_strategy.md` — Distribution channels
- `content/` — 10 markdown files (episodes, tips, tutorials)

---

## Content Template (สำคัญ)

ทุก content file ต้องเป็นไปตาม template นี้:

```markdown
# [EP.XX] Title

## สรุปสัปดาห์นี้ (TL;DR)
- ทำอะไรได้บ้าง
- ผลลัพธ์สำคัญ

## 🔧 ทำอะไร
[รายละเอียด process, มี screenshot/code]

## 🎯 สิ่งที่ได้เรียนรู้
[insights จากสิ่งที่ทำ]

## 🤔 ปัญหาที่เจอ + วิธีแก้
[honest reflection]

## 📅 สัปดาห์หน้าจะทำอะไร
[tangibly next steps]
```

---

## Your Tasks (ตาม EMI issues)

1. **สร้าง landing page** สำหรับ Roblox Dev Diary
2. **สร้าง content cards** แสดง episode/tip/tutorial แต่ละตัว
3. **สร้าง distribution pages** สำหรับแต่ละ content pillar (Devlog, Tutorial, Insight)
4. **เพิ่ม social share buttons** สำหรับแต่ละ post
5. **เพิ่ม newsletter signup form**
6. **แก้ไข/ปรับปรุง UI components** ตาม feedback

---

## Tech Stack

- **HTML/CSS/JavaScript** — static site, ไม่ต้อง framework
- **Deploy:** GitHub Pages หรือ static hosting ใดก็ได้
- **Content source:** อ่านจาก `/content/*.md` files โดยตรง

---

## Workflow

1. อ่าน `/content/` ทุก file ก่อนเริ่มทำ
2. ทำ task ที่ได้รับมอบหมายใน Paperclip (EMI-34 ถึง EMI-42)
3. หลังทำเสร็จ → commit + push ไปที่ `github.com/MikHaiLz404/memory-atelier.git`
4. รอ review จาก Content Writer (ถ้าต้องการ)

---

## Quality Standards

- **Tone:** จริงใจ, เป็นกันเอง, ไม่formal — เหมือนคุยกับเพื่อน dev
- **ภาษา:** ไทย (content) / อังกฤษ (code + technical terms)
- **Code blocks:** ใส่ syntax highlighting สำหรับ Lua
- **Images:** ใช้ screenshot จริงจาก Roblox Studio ถ้ามี
- **มี line breaks** ระหว่าง section ทุก 2-3 บรรทัด — อ่านง่ายบน mobile

---

## Git Workflow

```bash
git add .
git commit -m "type: description

- Task: EMI-XX
- What: brief"
git push origin main
```

**Commit types:** `feat:` `fix:` `content:` `ui:` `docs:`

---

## Important

- **ห้าม** commit API keys, tokens, หรือ secrets ใดๆ
- ถ้าต้องการ config อะไร → ใช้ `.env.example` แทน
- ถามก่อนถ้าไม่แน่ใจเรื่อง design decision
- ทำให้เสร็จทีละ task — อย่าทำหลายอย่างพร้อมกัน