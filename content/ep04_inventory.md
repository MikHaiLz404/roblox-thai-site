# [EP.04] Inventory System — ครั้งแรก + สิ่งที่ผิดพลาด

> **Published:** 2026-05-22 | **Status:** Draft  
> **Series:** Roblox Dev Diary | **Author:** EMILY.Co

---

## TL;DR (2-4 bullet points)

- ✅ สร้าง inventory system แบบ basic ได้แล้ว — เก็บ item ใส่ bag เอาออกได้
- ✅ เข้าใจโครงสร้างข้อมูลแบบ dictionary + array ใน Luau
- 📊 พบว่า approach แรกใช้ไม่ได้ — ต้องเปลี่ยนวิธีคิดเรื่อง data structure

---

## 🔧 ทำอะไร

### 1. วางโครงสร้าง Inventory แบบแรก (ที่พัง)

เริ่มต้นด้วยความคิดว่า "inventory ก็แค่ตารางเก็บของ" — สร้าง `Inventory` folder ใน `ServerStorage` แล้วใส่ `Part` ต่างๆ ลงไปเป็น item แต่ละชิ้น

```lua
-- ❌ Approach แรก: เก็บ item เป็น Part จริงๆ ใน folder
local ServerStorage = game:GetService("ServerStorage")
local Inventory = ServerStorage:FindFirstChild("Inventory") or Instance.new("Folder")
Inventory.Name = "Inventory"
Inventory.Parent = ServerStorage

-- Clone item เข้า inventory
local function pickupItem(itemName)
    local template = ServerStorage:FindFirstChild(itemName)
    if template then
        local newItem = template:Clone()
        newItem.Parent = Inventory
    end
end
```

**สิ่งที่ผิด:** เก็บ Part จริงๆ ใน folder — เวลา player เก็บของ 50 ชิ้น ก็ต้อง clone 50 Parts ซึ่งกิน memory และไม่ scalable

### 2. เปลี่ยนมาใช้ Data Structure แบบ Dictionary

หลังจากลองแล้วมันช้า + laggy ตอน test — เลย research หาวิธีที่ดีกว่า สุดท้ายใช้ **dictionary-based inventory** แทน

```lua
-- ✅ Approach ที่ 2: เก็บข้อมูลเป็น table/dictionary
local PlayerInventory = {}

local function createInventory(player)
    PlayerInventory[player.UserId] = {
        slots = {}, -- Dictionary เก็บ itemId -> itemData
        maxSlots = 20,
        gold = 0
    }
end

local function addItem(player, itemId, itemData)
    local inv = PlayerInventory[player.UserId]
    if not inv then return false end
    
    -- เก็บแค่ metadata ไม่ต้อง clone Part
    inv.slots[itemId] = {
        itemId = itemId,
        name = itemData.name,
        quantity = itemData.quantity or 1,
        type = itemData.type
    }
    return true
end
```

**สิ่งที่ได้:** ประหยัด memory เยอะ — เก็บแค่ data ไม่ต้องสร้าง object จริง

### 3. สร้าง UI Inventory แบบ Grid

ตอนแรกคิดจะใช้ ScreenGui ธรรมดา แต่พอลองทำแล้ว UI มันซับซ้อน — เลยเปลี่ยนมาใช้ **ScrollingFrame + GridLayout** แทน

```lua
-- สร้าง Inventory UI
local function createInventoryUI(player)
    local screenGui = Instance.new("ScreenGui")
    screenGui.Name = "InventoryUI"
    screenGui.ResetOnSpawn = false
    
    local frame = Instance.new("Frame")
    frame.Size = UDim2.new(0, 300, 0, 400)
    frame.Position = UDim2.new(0.5, -150, 0.5, -200)
    frame.BackgroundColor3 = Color3.fromRGB(30, 30, 50)
    frame.Parent = screenGui
    
    local scrollFrame = Instance.new("ScrollingFrame")
    scrollFrame.Size = UDim2.new(1, -20, 1, -60)
    scrollFrame.Position = UDim2.new(0, 10, 0, 50)
    scrollFrame.CanvasSize = UDim2.new(0, 0, 0, 500)
    scrollFrame.Parent = frame
    
    local gridLayout = Instance.new("UIGridLayout")
    gridLayout.CellSize = UDim2.new(0, 50, 0, 50)
    gridLayout.CellPadding = UDim2.new(0, 5, 0, 5)
    gridLayout.Parent = scrollFrame
    
    screenGui.Parent = player.PlayerGui
    return screenGui
end
```

**สิ่งที่ได้:** UI เลื่อนได้ เก็บ item เยอะได้โดยไม่ล้นหน้าจอ

---

## 🎯 สิ่งที่ได้เรียนรู้

**1. Data structure สำคัญกว่า code structure**
ตอนแรกมัวแต่สนใจว่า UI สวยไหม แต่พอ data structure ผิด อะไรๆ ก็พังหมด — ต้องคิดจาก data ก่อนแล้วค่อยสร้าง UI

**2. Dictionary ใน Luau เจ๋งมาก**
`slots[itemId] = {...}` ดูแลง่ายกว่าการใช้ array + loop หาของ — เข้าถึง item ได้ตรงๆ โดยไม่ต้อง iterate

**3. Clone object จริงๆ ใน server แพงมาก**
ทุกครั้งที่ clone Part มาเก็บใน inventory memory ขึ้นอย่างรวดเร็ว — ถ้าเกมมี item 100+ ชิ้น ก็พังแน่

---

## 🤔 ปัญหาที่เจอ + วิธีแก้

### ปัญหา 1: UI Inventory ซ้อนกันหลายอัน

**สิ่งที่เกิด:** กดเปิด inventory หลายที UI มันซ้อนกันไปเรื่อยๆ

**สาเหตุ:** ไม่ได้เช็คว่า UI มีอยู่แล้วหรือยัง — ทุกครั้งที่กดปุ่มก็สร้าง UI ใหม่ทับลงไป

**วิธีแก้:**
```lua
-- ✅ ตรวจสอบก่อนสร้าง
local function toggleInventory(player)
    local existingUI = player.PlayerGui:FindFirstChild("InventoryUI")
    
    if existingUI then
        existingUI:Destroy()
        return
    end
    
    createInventoryUI(player)
end
```

---

### ปัญหา 2: Data หายตอน server restart

**สิ่งที่เกิด:** ตอนทดสอบ ปิด Roblox Studio แล้วเปิดใหม่ — inventory กลับมาว่างเปล่า

**สาเหตุ:** ไม่ได้ใช้ DataStore — เก็บข้อมูลแค่ใน memory (PlayerInventory table) ซึ่งหายเมื่อ server ปิด

**วิธีแก้:**
```lua
local DataStoreService = game:GetService("DataStoreService")
local inventoryStore = DataStoreService:GetDataStore("Inventory_v1")

-- บันทึกตอน player ออก
local function saveInventory(player)
    local success, err = pcall(function()
        inventoryStore:SetAsync(player.UserId, PlayerInventory[player.UserId])
    end)
    if not success then
        warn("Failed to save inventory:", err)
    end
end

-- โหลดตอน player เข้า
local function loadInventory(player)
    local success, data = pcall(function()
        return inventoryStore:GetAsync(player.UserId)
    end)
    
    if success and data then
        PlayerInventory[player.UserId] = data
    else
        createInventory(player)
    end
end
```

---

### ปัญหา 3: ScrollingFrame ไม่เลื่อน

**สิ่งที่เกิด:** ใส่ item เยอะๆ แต่ scroll ไม่ไป — canvas ไม่ยืด

**สาเหตุ:** ลืมตั้ง `AutomaticCanvasSize` หรือคำนวณ canvas size เองไม่ถูกต้อง

**วิธีแก้:**
```lua
-- ✅ ตั้ง AutomaticCanvasSize
scrollFrame.AutomaticCanvasSize = Enum.AutomaticSize.Y
```

---

### ปัญหา 4: Item ซ้อนกันได้ (stack) แต่ไม่มี logic

**สิ่งที่เกิด:** เก็บ potion 10 ขวด — แต่ละขวดแยกกันเก็บใน slot คนละช่อง เต็มเร็วมาก

**วิธีแก้:**
```lua
local function addItem(player, itemId, itemData)
    local inv = PlayerInventory[player.UserId]
    
    -- เช็คว่ามี item ประเภทเดียวกันอยู่แล้วไหม ถ้ามีก็ stack
    for existingId, existingItem in pairs(inv.slots) do
        if existingItem.name == itemData.name and existingItem.quantity < 99 then
            existingItem.quantity = existingItem.quantity + (itemData.quantity or 1)
            return true
        end
    end
    
    -- ถ้าไม่มี ก็เพิ่มใหม่
    inv.slots[itemId] = {
        itemId = itemId,
        name = itemData.name,
        quantity = itemData.quantity or 1,
        type = itemData.type
    }
    return true
end
```

---

## 📅 สัปดาห์หน้าจะทำอะไร

- [ ] ต่อ inventory UI ให้ sync กับ data structure ให้ได้จริงๆ
- [ ] ทำระบบ Equip/Unequip item (click แล้วใส่/ถอด)
- [ ] ลองระบบ shop ซื้อของด้วย gold
- [ ] เขียน EP5: "ครั้งแรกที่ใช้ DataStore + การโหลด save data"

---

## 📚 Links

- [Roblox Inventory System Tutorial](https://developer.roblox.com/en-us/articles/Inventory-system) — reference หลัก
- [DataStore Tutorial](https://developer.roblox.com/en-us/articles/Data-store) — ใช้ตอนแก้ปัญหา data หาย
- [UI Grid Layout](https://developer.roblox.com/en-us/articles/UIGridLayout) — ช่วยจัด layout ใน inventory

---

*Next: [EP.05 — DataStore & Save System]*