# 💡 Quick Tip: Luau Basics — สำหรับคนที่เขียน Python/JS มาก่อน

> **Series:** Quick Tips | **Topic:** Luau scripting basics  
> **Published:** 2026-05-xx | **Status:** Draft

---

## TL;DR

Luau (ภาษาของ Roblox) คนเขียน Python/JS ใช้ได้เลย แต่ต้องรู้ 4 จุดต่างสำคัญ

---

## ปัญหา

อยากเริ่มทำเกมบน Roblox แต่ไม่เคยเขียน Lua/Luau มาก่อน

---

## วิธีทำ

### 1. Variables: `local` ต้องใส่

```lua
-- Python/JS:  x = 10
-- Luau:
local x = 10

-- global (ไม่ควร)  x = 10  -- ทำได้แต่ไม่แนะนำ
```

**ทำไม:** Roblox ใช้ `local` สำหรับทุกอย่างที่ไม่ใช่ global — ถ้าไม่ใส่ `local` มันจะกลายเป็น global ซึ่งทำให้เกิด bug ยากหา

---

### 2. Functions: `function` ตามด้วย `end`

```lua
-- Python:
-- def greet(name):
--     return f"Hello, {name}!"

-- Luau:
local function greet(name)
    return "Hello, " .. name .. "!"
end
```

`end` คือตัวปิด function / if / loop แทน indentation (แม้ Roblox ก็ใช้ indentation ด้วย แต่ `end` บังคับ)

---

### 3. ต่อ string ด้วย `..` ไม่ใช่ `+`

```lua
-- Python:    "Hello " + name
-- JavaScript: `Hello ${name}`
-- Luau:       "Hello " .. name
```

ถ้าลืม ใช้ `..` จะ error

---

### 4. เข้าถึง Object Properties — ต้องใช้ `.`

```lua
local part = Instance.new("Part")
part.Size = Vector3.new(4, 1, 4)      -- สร้าง part ขนาด 4x1x4
part.BrickColor = BrickColor.new("Red")
part.Parent = workspace               -- ใส่ใน game world

-- เปลี่ยนสีตอนผู้เล่นแตะ
local function onTouch(otherPart)
    part.BrickColor = BrickColor.new("Blue")  -- . เข้าถึง property
end

part.Touched:Connect(onTouch)          -- event listener
```

---

### 5. Events: `:Connect(callback)` ต้องจำ

```lua
-- ทำงานเมื่อผู้เล่นกดปุ่ม
local button = script.Parent

local function onClick()
    print("Button clicked!")
end

button.MouseButton1Click:Connect(onClick)
```

ทุก event ใน Roblox ใช้ `:Connect(callback)` — คล้ายกับ `addEventListener` ใน JavaScript

---

## สรุป

- Python/JS `x = 10` → Luau `local x = 10`
- Python/JS `f"Hello {name}"` → Luau `"Hello " .. name`
- Python/JS indentation → Luau ใช้ `end` keyword
- Python/JS `.method()` → Roblox events ใช้ `:Method()`

---

## ข้อมูลเพิ่มเติม

- [Roblox Luau Docs](https://developer.roblox.com/en-us/articles/Luau)
- [DevHub Scripting Tutorial](https://developer.roblox.com/en-us/articles/Scripting)

---

*Next Tip: RemoteEvents ทำงานยังไง →**