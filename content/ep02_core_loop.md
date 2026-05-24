# [EP.02] Core Loop — คิดยังไง

> **Published:** 2026-05-xx | **Status:** Draft (Pending P'Jo review)  
> **Series:** Roblox Dev Diary | **Author:** EMILY.Co

---

## TL;DR (2-4 bullet points)

- ✅ วาง core loop แรกของเกม: Collect → Level Up → Unlock
- ✅ เขียน code ระบบ collection + inventory แบบง่าย
- 📊 ได้ loop ที่เล่นได้เรื่อยโดยไม่เบื่อ

---

## 🔧 ทำอะไร

### 1. Core Loop คืออะไร — คิดก่อนเขียน code

Core loop คือ "วงจรหลัก" ที่ player ทำซ้ำแล้วซ้ำเล่าตลอดเวลาที่เล่นเกม ถ้า loop นี้ไม่สนุก เกมก็ไม่สนุกไม่ว่าจะมีฟีเจอร์อื่นเพิ่มมากแค่ไหน

**สูตรง่ายๆ:**
```
Core Loop = ทำ Action → ได้ Reward → ทำให้ต้องการทำ Action ต่อ
```

**3 ขั้นตอนที่ช่วยคิด:**

**ขั้นที่ 1: ตอบคำถาม — "ผู้เล่นทำอะไรเป็นหลัก?"**
- เดิน? กระโดด? ยิง? เก็บของ? สร้าง?
- ตั้งแต่ EP1 เราเลือกไว้ว่าเกมจะเป็น "สำรวจ + เก็บของ + เลเวลอัพ"

**ขั้นที่ 2: ตอบคำถาม — "ทำแล้วได้อะไร?"**
- ได้ item ใหม่? ได้ EXP? ได้ cosmetic?
- Reward ต้องมี "ความรู้สึกดี" ทันที — เสียง, แสง, ตัวเลขขึ้น

**ขั้นที่ 3: ตอบคำถาม — "ได้แล้วทำให้อยากทำอะไรต่อ?"**
- item ใหม่ไปต่อยพลัง? unlock content ใหม่?
- Loop ต้อง "ปิด" ได้ — ไม่ใช่เปิดไปเรื่อยๆ โดยไม่มีจุดจบ

### 2. วาง Core Loop ของโปรเจคนี้

**Loop ที่ตั้งใจ:**

```
[เก็บ item] → [เลเวลอัพ player] → [ปลดล็อก skill/area ใหม่] → [เก็บ item ที่ยากขึ้น]
```

แต่ละขั้นตอนต้องให้ "immediate feedback" — player รู้สึกว่าทำแล้วได้ผลตอบรับทันที

### 3. เขียน Code: ระบบ Collection + Player Level

**เริ่มจากระบบเก็บของ (Item Pickup):**

```lua
-- ItemPickupScript (ModuleScript)
local ItemPickup = {}
ItemPickup.__index = ItemPickup

function ItemPickup.new(config)
    local self = setmetatable({}, ItemPickup)
    self.itemName = config.itemName or "Unknown Item"
    self.rarity = config.rarity or "Common"
    self.value = config.value or 1
    self.model = config.model
    return self
end

-- สร้าง item pickup instance ใน workspace
function ItemPickup:Spawn(position)
    local pickup = Instance.new("Part")
    pickup.Name = self.itemName
    pickup.Size = Vector3.new(2, 2, 2)
    pickup.Position = position
    pickup.Material = Enum.Material.Neon
    pickup.CanCollide = false
    
    -- ตั้งสีตาม rarity
    local colors = {
        Common = BrickColor.new("Bright green"),
        Rare = BrickColor.new("Bright blue"),
        Epic = BrickColor.new("Bright violet"),
        Legendary = BrickColor.new("Bright red"),
    }
    pickup.BrickColor = colors[self.rarity] or colors.Common
    
    -- เพิ่ม particle effect เล็กน้อย
    local light = Instance.new("PointLight")
    light.Color = Color3.new(1, 1, 1)
    light.Brightness = 1
    light.Range = 8
    light.Parent = pickup
    
    pickup.Parent = workspace
    
    return pickup
end

return ItemPickup
```

**ตัวจับ event เมื่อ player เก็บของ:**

```lua
-- PickupHandler (LocalScript ใน StarterPlayerScripts)
local Players = game:GetService("Players")
local player = Players.LocalPlayer

local function onTouched(otherPart)
    local character = player.Character
    if not character then return end
    
    local humanoid = character:FindFirstChild("Humanoid")
    if not humanoid then return end
    
    -- ตรวจว่า part ที่ชนคือ item หรือเปล่า
    local pickup = otherPart.Parent
    if pickup:IsA("ModuleScript") then return end
    
    -- ถ้าเป็น part ที่มีชื่อ item
    if pickup:IsA("Part") and pickup.Name ~= "HumanoidRootPart" then
        local itemName = pickup.Name
        
        -- Fire event ไปหา server
        local remoteEvent = game:GetService("ReplicatedStorage"):WaitForChild("PickupItemEvent")
        remoteEvent:FireServer(itemName)
        
        -- ลบ item ออกจาก world (client-side prediction)
        pickup:Destroy()
        
        print("🎒 เก็บได้: " .. itemName)
    end
end

-- วน loop ติดตาม part ใหม่ที่ spawn
game:GetService("Workspace").ChildAdded:Connect(function(child)
    if child:IsA("Part") then
        child.Touched:Connect(onTouched)
    end
end)
```

**ระบบ Player Level (Server-side):**

```lua
-- PlayerLevelModule (ModuleScript)
local PlayerLevel = {}
PlayerLevel.__index = PlayerLevel

-- Config
local MAX_LEVEL = 50
local EXP_TABLE = {}
for i = 1, MAX_LEVEL do
    -- EXP ที่ต้องการเพื่อขึ้นเลเวล i+1
    EXP_TABLE[i] = i * 100 + (i * i * 10)
end

function PlayerLevel.new()
    local self = setmetatable({}, PlayerLevel)
    self.level = 1
    self.currentExp = 0
    self.totalExp = 0
    return self
end

function PlayerLevel:GainExp(amount)
    self.currentExp = self.currentExp + amount
    self.totalExp = self.totalExp + amount
    
    -- เช็คว่าขึ้นเลเวลหรือเปล่า
    while self.level < MAX_LEVEL and self.currentExp >= EXP_TABLE[self.level] do
        self.currentExp = self.currentExp - EXP_TABLE[self.level]
        self.level = self.level + 1
        print("⬆️ ขึ้นเลเวล! ตอนนี้เลเวล " .. self.level)
    end
end

function PlayerLevel:GetExpForNextLevel()
    return EXP_TABLE[self.level] or math.huge
end

function PlayerLevel:GetProgress()
    local needed = self:GetExpForNextLevel()
    return {
        level = self.level,
        currentExp = self.currentExp,
        expNeeded = needed,
        progress = self.currentExp / needed
    }
end

return PlayerLevel
```

**จัดการ level ของ player แต่ละคน:**

```lua
-- LevelService (Regular Script ใน ServerScriptService)
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local PlayerLevel = require(script:WaitForChild("PlayerLevelModule"))

local playerLevels = {}

-- สร้าง level data เมื่อ player เข้าเกม
Players.PlayerAdded:Connect(function(player)
    playerLevels[player.UserId] = PlayerLevel.new()
    print("📊 Player " .. player.Name .. " เริ่มที่เลเวล 1")
end)

-- ลบเมื่อ player ออก
Players.PlayerRemoving:Connect(function(player)
    playerLevels[player.UserId] = nil
end)

-- RemoteEvent สำหรับเก็บ item
local pickupEvent = Instance.new("RemoteEvent")
pickupEvent.Name = "PickupItemEvent"
pickupEvent.Parent = ReplicatedStorage

pickupEvent.OnServerEvent:Connect(function(player, itemName)
    local levelData = playerLevels[player.UserId]
    if not levelData then return end
    
    -- คำนวณ EXP จาก item rarity
    local expReward = 10
    if string.find(itemName, "Rare") then
        expReward = 50
    elseif string.find(itemName, "Epic") then
        expReward = 150
    elseif string.find(itemName, "Legendary") then
        expReward = 500
    end
    
    levelData:GainExp(expReward)
    
    -- แจ้ง player ผ่าน UI
    local progress = levelData:GetProgress()
    local updateEvent = ReplicatedStorage:WaitForChild("LevelUpdateEvent")
    updateEvent:FireClient(player, progress)
end)
```

### 4. สร้าง UI แสดง Level Progress

```lua
-- LevelUI (LocalScript ใน StarterPlayerScripts)
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local TweenService = game:GetService("TweenService")

local player = Players.LocalPlayer
local playerGui = player:WaitForChild("PlayerGui")

-- สร้าง UI
local screenGui = Instance.new("ScreenGui")
screenGui.Name = "LevelUI"
screenGui.Parent = playerGui

local frame = Instance.new("Frame")
frame.Name = "LevelFrame"
frame.Size = UDim2.new(0, 200, 0, 60)
frame.Position = UDim2.new(0.5, -100, 1, -80)
frame.BackgroundColor3 = Color3.fromRGB(30, 30, 50)
frame.BackgroundTransparency = 0.3
frame.Parent = screenGui

local levelLabel = Instance.new("TextLabel")
levelLabel.Name = "LevelLabel"
levelLabel.Size = UDim2.new(1, 0, 0, 25)
levelLabel.Position = UDim2.new(0, 10, 0, 5)
levelLabel.BackgroundTransparency = 1
levelLabel.TextColor3 = Color3.new(1, 1, 1)
levelLabel.Text = "LVL 1"
levelLabel.TextSize = 20
levelLabel.Font = Enum.Font.GothamBold
levelLabel.Parent = frame

local progressBar = Instance.new("Frame")
progressBar.Name = "ProgressBar"
progressBar.Size = UDim2.new(0.9, 0, 0, 15)
progressBar.Position = UDim2.new(0, 10, 0, 32)
progressBar.BackgroundColor3 = Color3.fromRGB(50, 50, 70)
progressBar.Parent = frame

local fillBar = Instance.new("Frame")
fillBar.Name = "FillBar"
fillBar.Size = UDim2.new(0, 0, 1, 0)
fillBar.BackgroundColor3 = Color3.fromRGB(100, 200, 100)
fillBar.BackgroundTransparency = 0.2
fillBar.Parent = progressBar

-- รับ event อัพเดตจาก server
local updateEvent = ReplicatedStorage:WaitForChild("LevelUpdateEvent")
updateEvent.OnClientEvent:Connect(function(data)
    levelLabel.Text = "LVL " .. data.level
    
    -- Animate progress bar
    local tweenInfo = TweenInfo.new(0.5, Enum.EasingStyle.Quad)
    local tween = TweenService:Create(fillBar, tweenInfo, {
        Size = UDim2.new(data.progress, 0, 1, 0)
    })
    tween:Play()
    
    -- แสดง +EXP floating text
    if data.levelChanged then
        local popup = Instance.new("TextLabel")
        popup.Name = "LevelUpPopup"
        popup.Size = UDim2.new(0, 200, 0, 40)
        popup.Position = UDim2.new(0.5, -100, 0.4, 0)
        popup.BackgroundTransparency = 1
        popup.Text = "⬆️ LEVEL UP!"
        popup.TextColor3 = Color3.fromRGB(255, 215, 0)
        popup.TextSize = 28
        popup.Font = Enum.Font.GothamBold
        popup.Parent = screenGui
        
        -- ลบ popup หลัง 2 วินาที
        task.delay(2, function()
            popup:Destroy()
        end)
    end
end)
```

---

## 🎯 สิ่งที่ได้เรียนรู้

**1. Core loop ต้องเริ่มจาก "ทำอะไรสนุกที่สุด" ไม่ใช่ "อะไรยากที่สุด"**
ตอนแรกคิดจะทำระบบ crafting ซับซ้อน แต่เปลี่ยนมาเริ่มจาก "เก็บของ → เลเวลอัพ" ก่อน เพราะสนุกเร็วกว่า และเป็น core loop ที่เล่นได้เรื่อยๆ โดยไม่ต้องลงทุนเยอะ

**2. Reward ต้องให้ "ทันที"**
ถ้า player เก็บของแล้วต้องรอ 3 วินาทีถึงจะเห็นผล ความรู้สึก "ความสนุก" หายไปเยอะ — feedback loop ต้องเร็ว

**3. ModuleScript เป็นเพื่อนดี**
ตั้งแต่แบ่ง code เป็น ModuleScript แล้ว reuse ง่ายมาก อยากเปลี่ยน config ก็แก้ที่เดียว

---

## 🤔 ปัญหาที่เจอ + วิธีแก้

**ปัญหา:** FireServer จาก client ไม่ได้เพราะถูก filter เป็น exploit ตอนทดสอบ

**วิธีแก้:** ใช้ RemoteEvent แต่ต้อง validate ฝั่ง server ด้วย — อย่าปล่อยให้ client ส่งข้อมูลมาโดยตรงโดยไม่ตรวจ

```lua
-- ตรวจ server-side ว่า player อยู่ในระยะเก็บจริงหรือเปล่า
-- ถ้าไม่ใช่ ให้ reject
```

**อีกปัญหา:** UI progress bar ไม่ smooth

**วิธีแก้:** ใช้ TweenService แทนการ set size ตรงๆ — animate แล้วดูดีกว่าเยอะ

---

## 📅 สัปดาห์หน้าจะทำอะไร

- ทำระบบ Inventory UI (show item ที่เก็บได้)
- เพิ่ม Rare/Epic/Legendary item spawn ตาม rarity
- ลองระบบ Shop ซื้อของด้วย in-game currency
- เริ่มวาง map layout แรก

---

## 📚 Links

- [Roblox Developer Hub — Events](https://developer.roblox.com/en-us/articles/Roblox-Events)
- [TweenService Documentation](https://developer.roblox.com/en-us/articles/TweenService)
- [Luau Module Scripts](https://developer.roblox.com/en-us/articles/Module-Scripts)
- [DevForum Thailand](https://devforum.roblox.com/) (community ไทย)

---

*Previous: [EP.01 — แนะนำโปรเจค]*  
*Next: [EP.03 — Map Layout วางยังไง]*