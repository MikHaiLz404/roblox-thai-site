# [EP.01] แนะนำโปรเจค: ทำไมถึงเลือกทำเกมบน Roblox

> **Published:** 2026-05-xx | **Status:** Draft (Pending P'Jo review)  
> **Series:** Roblox Dev Diary | **Author:** EMILY.Co

---

## สรุปสัปดาห์นี้ (TL;DR)

- ✅ เลือกแพลตฟอร์ม + เริ่ม project ใหม่
- ✅ วาง scope MVP ของเกมแรก
- 📊 ได้ codebase พร้อม player spawn + basic movement

---

## 🔧 ทำอะไร

### 1. เลือกแพลตฟอร์ม

ตัดสินใจเลือก **Roblox Studio** แทน Unity/Unreal หรือ Godot เพราะ 3 เหตุหลัก:

**a) Solo dev friendly**
- Roblox มี infrastructure พร้อมหมด — authentication, multiplayer relay, datastore, social features
- ไม่ต้องสร้าง server infrastructure เอง
- ลดงานที่ไม่เกี่ยวกับ "การทำเกม" ลงเยอะ

**b) ตลาดไทย**
- ผู้เล่น Roblox ชาวไทยติด Top 10 ของโลก
- เกมไทยบน Roblox ยังมีน้อยมาก
- โอกาสที่จะเป็น "เกมไทยตัวแรก" ในหลายแนวยังมีอยู่

**c) Luau scripting (ง่ายกว่าที่คิด)**
- Lua/Luau เป็นภาษาที่เข้าใจง่าย — อ่าน syntax แล้วเข้าใจได้เลย
- มี community ที่ช่วยเหลือเยอะมากบน DevForum
- AI coding assistant ช่วยได้ดีเพราะ syntax ง่าย

### 2. เริ่มโปรเจคใหม่

**สิ่งที่ทำวันแรก:**
```lua
-- สร้าง Spawn location พื้นฐาน
local spawn = Instance.new("SpawnLocation")
spawn.Parent = workspace
spawn.Size = Vector3.new(8, 1, 8)
spawn.Material = Enum.Material.SmoothPlastic
spawn.BrickColor = BrickColor.new("Medium stone grey")
```

```lua
-- Basic player movement (กด WASD เดินได้เลย — Roblox default)
-- ไม่ต้องเขียนเอง มากับ character model
```

สิ่งที่ได้: ผู้เล่น spawn ได้, เดินได้, jump ได้ — แค่นี้ก็พร้อมเริ่มแล้ว

### 3. วาง Scope MVP

**เกมที่กำลังทำ:** ยังไม่มีชื่อ (working title: "Roblox School Project 01")

Core loop แรกที่เป็นไปได้:
- Player เดินสำรวจ map
- เก็บ items / เลเวลอัพ / สะสม
- Solo play ก่อน (MVP)

---

## 🎯 สิ่งที่ได้เรียนรู้

**1. Roblox Studio เจ๋งกว่าที่คิด**
เคยมองว่า Roblox เป็น "แค่เกมเด็ก" แต่พอใช้จริง tooling ดีมาก — มี animation editor ในตัว, physics testing, และ plugin ecosystem ที่ครบ

**2. Luau ใช้ง่ายกว่าที่คิด**
ไม่ต้องกลัว syntax ใหม่ — คนเขียน Python/JS ปรับตัวได้เร็ว

**3. Movement ที่มากับ Roblox ใช้ได้เลย**
ไม่ต้องเขียน movement เองตั้งแต่แรก — ของที่มากับ Roblox ก็เพียงพอแล้ว

---

## 🤔 ปัญหาที่เจอ + วิธีแก้

**ปัญหา:** Roblox Studio เวอร์ชันล่าสุด (2026) มี UI เปลี่ยนเยอะ — tutorial เก่าบางอันหาข้อมูลยาก

**วิธีแก้:** ใช้ Roblox DevHub เป็น primary source แทน YouTube tutorials

---

## 📅 สัปดาห์หน้าจะทำอะไร

- ออกแบบ map layout แรก
- ลองระบบ inventory (ถ้าทัน)
- เริ่มเขียน EP2: Core Loop Design

---

## 📚 Links

- [Roblox Developer Hub](https://developer.roblox.com/)
- [Roblox Studio Download](https://www.roblox.com/create)
- [DevForum Thailand](https://devforum.roblox.com/) (community ไทย)

---

*Next: [EP.02 — Core Loop Design คิดยังไง]**