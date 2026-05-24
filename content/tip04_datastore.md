# 💡 Quick Tip: DataStore 101 — Save/Load Player Data

> **Series:** Quick Tips | **Topic:** Roblox DataStore  
> **Published:** 2026-05-xx | **Status:** Draft

---

## TL;DR

DataStore คือวิธี save ข้อมูลผู้เล่น (เหรียญ, level, inventory) ลง server ของ Roblox แล้ว load กลับมาเมื่อเล่นครั้งต่อไป

---

## ปัญหา

ผู้เล่นออกจากเกมไป แล้วกลับมาใหม่ ข้อมูล (เหรียญ, level) หายไปหมด — ต้อง save ตอนออก และ load ตอนเข้า

---

## วิธีทำ

### 1. เปิด DataStore Service

ไปที่ `Game Settings` → `Security` → เปิด `Enable Studio Access to API Services`

### 2. Save เมื่อผู้เล่นออก

```lua
-- ServerScriptService/PlayerData.lua
local DataStoreService = game:GetService("DataStoreService")
local playerDataStore = DataStoreService:GetDataStore("PlayerData_v1")

local function savePlayerData(player)
    local leaderstats = player:FindFirstChild("leaderstats")
    if not leaderstats then return end
    
    local data = {
        coins = leaderstats:FindFirstChild("Coins").Value,
        level = leaderstats:FindFirstChild("Level").Value,
    }
    
    local success, err = pcall(function()
        playerDataStore:SetAsync(player.UserId, data)
    end)
    
    if not success then
        warn("Save failed: " .. err)
    end
end

-- เมื่อผู้เล่นออก
game.Players.PlayerRemoving:Connect(function(player)
    savePlayerData(player)
end)
```

### 3. Load ตอนผู้เล่นเข้า

```lua
local function loadPlayerData(player)
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player
    
    local coins = Instance.new("IntValue")
    coins.Name = "Coins"
    coins.Value = 0
    coins.Parent = leaderstats
    
    local level = Instance.new("IntValue")
    level.Name = "Level"
    level.Value = 1
    level.Parent = leaderstats
    
    -- Load จาก DataStore
    local success, data = pcall(function()
        return playerDataStore:GetAsync(player.UserId)
    end)
    
    if success and data then
        coins.Value = data.coins or 0
        level.Value = data.level or 1
    end
end

game.Players.PlayerAdded:Connect(loadPlayerData)
```

### 4. Auto-save ทุก 30 วินาที

```lua
while true do
    wait(30)
    for _, player in ipairs(game.Players:GetPlayers()) do
        savePlayerData(player)
    end
end
```

---

## สรุป

- ใช้ `DataStoreService:GetDataStore("Name")` สร้าง DataStore
- `SetAsync(key, data)` → save
- `GetAsync(key)` → load
- ใช้ `pcall()` ครอบทุก operation เพราะ DataStore ล้มเหลวได้บ่อย
- Save ตอน `PlayerRemoving` + auto-save ทุก 30 วินาที

---

## ข้อมูลเพิ่มเติม

- [DataStore Docs](https://developer.roblox.com/en-us/articles/DataStore)
- [DataStore Limits](https://developer.roblox.com/en-us/articles/DataStore)

---

*Next Tip: การใช้ TweenService สำหรับ Animation →*