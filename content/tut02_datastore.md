# 📚 DataStore — Save/Load ข้อมูลผู้เล่นใน Roblox

## Overview

**TL;DR:** DataStoreService เก็บข้อมูลผู้เล่นไว้บน Roblox server — save ตอนออก และ load ตอนเข้า ใช้ได้ฟรี (แต่มี limit)

**Prerequisites:**
- รู้จัก Lua พื้นฐาน (tables, pcall)
- เข้าใจเรื่อง Server → Client communication
- มี product ใน Roblox (DataStore ทำงานได้บน Basic tier ขึ้นไป)

---

## ปัญหา

เกม Roblox ที่ให้ผู้เล่นเก็บ exp, items, inventory — ถ้าไม่มี DataStore → ข้อมูลหายทุกครั้งที่ออกจากเกม

**ตัวอย่าง:**
```
1. Player A เล่นเกม เลเวลอัพ 5 รอบ → ปิดเกม
2. Player A เข้าเกมใหม่ → กลับมาเลเวล 1 ใหม่ (ข้อมูลหาย)
```

DataStore แก้ปัญหานี้ด้วยการเก็บข้อมูลบน Roblox cloud และดึงกลับมาเมื่อ player login

---

## วิธีทำ

### Step 1: สร้าง Profile Template

กำหนดโครงสร้างข้อมูลที่จะเก็บ:

```lua
-- ProfileService.lua (ServerScriptService)
local DataStoreService = game:GetService("DataStoreService")
local Players = game:GetService("Players")

local ProfileTemplate = {
    -- Player info
    displayName = "Player",
    joinDate = 0,

    -- Game progress
    level = 1,
    exp = 0,
    coins = 0,

    -- Inventory (items ที่ sở hữu)
    inventory = {}, -- [itemId] = quantity

    -- Stats
    kills = 0,
    deaths = 0,
    playTime = 0,

    -- Settings
    settings = {
        musicVolume = 0.5,
        sfxVolume = 1.0,
    },

    -- Meta
    lastSave = 0,
    version = 1,
}
```

### Step 2: สร้าง DataStore Manager

```lua
-- DataStoreManager.lua (ServerScriptService)
local DataStoreService = game:GetService("DataStoreService")
local Players = game:GetService("Players")
local RunService = game:GetService("RunService")

local DATA_STORE_NAME = "PlayerData_v1"
local AUTO_SAVE_INTERVAL = 60 -- ทุก 60 วินาที
local SESSION_LOCK_DURATION = 1800 -- 30 นาที (lock ป้องกันข้อมูลซ้อน)

local DataStoreManager = {}
DataStoreManager.Profiles = {} -- [playerUserId] = profile

local playerDataStore = nil
local success, err = pcall(function()
    playerDataStore = DataStoreService:GetDataStore(DATA_STORE_NAME)
end)

if not success then
    warn("DataStore connection failed:", err)
end
```

### Step 3: Load Profile (เรียกตอน Player เข้า)

```lua
function DataStoreManager:loadProfile(player)
    local userId = player.UserId
    local profile = nil

    -- ลองดึงข้อมูลจาก DataStore
    local attempts = 0
    local maxAttempts = 3

    repeat
        attempts = attempts + 1
        local success, data = pcall(function()
            return playerDataStore:GetAsync(userId)
        end)

        if success then
            if data then
                -- มีข้อมูลเก่า → merge กับ template
                profile = self:mergeWithTemplate(data)
                print("Loaded existing profile for", player.Name)
            else
                -- ไม่มีข้อมูล → สร้างใหม่
                profile = self:createNewProfile(player)
                print("Created new profile for", player.Name)
            end
        else
            warn("Load attempt", attempts, "failed:", data)
            task.wait(1) -- รอก่อน retry
        end
    until success or attempts >= maxAttempts

    if not profile then
        -- ถ้า load ล้มเหลวทุกครั้ง → ใช้ profile ใหม่เลย (graceful degradation)
        profile = self:createNewProfile(player)
        warn("Using fallback new profile for", player.Name)
    end

    -- เก็บ profile ไว้ใน memory
    self.Profiles[userId] = profile
    profile.IsActive = true

    -- ส่งข้อมูลให้ client
    self:sendToClient(player, profile)

    return profile
end

function DataStoreManager:createNewProfile(player)
    return {
        displayName = player.DisplayName,
        joinDate = os.time(),
        level = 1,
        exp = 0,
        coins = 100, -- starter coins
        inventory = {},
        stats = { kills = 0, deaths = 0, playTime = 0 },
        settings = { musicVolume = 0.5, sfxVolume = 1.0 },
        lastSave = os.time(),
        version = 1,
    }
end

function DataStoreManager:mergeWithTemplate(data)
    -- รวมข้อมูลเก่ากับ template (กัน missing fields)
    local profile = {}
    for key, value in pairs(ProfileTemplate) do
        profile[key] = data[key] ~= nil and data[key] or value
    end

    -- เพิ่ม field ใหม่ที่ไม่มีในข้อมูลเก่า
    for key, value in pairs(data) do
        if profile[key] == nil then
            profile[key] = value
        end
    end

    -- อัพเดท version ถ้า schema เปลี่ยน
    profile.version = ProfileTemplate.version

    return profile
end
```

### Step 4: Save Profile (เรียกตอน Player ออก หรือ auto-save)

```lua
function DataStoreManager:saveProfile(player)
    local userId = player.UserId
    local profile = self.Profiles[userId]

    if not profile then
        warn("No profile to save for", player.Name)
        return false
    end

    profile.lastSave = os.time()
    profile.playTime = (profile.playTime or 0) + 1 -- +1 นาที

    local success, err = pcall(function()
        playerDataStore:SetAsync(userId, profile)
    end)

    if success then
        print("Saved profile for", player.Name)
        return true
    else
        warn("Save failed for", player.Name, ":", err)
        return false
    end
end

-- Auto-save ทุก X วินาที
task.spawn(function()
    while true do
        task.wait(AUTO_SAVE_INTERVAL)

        for userId, profile in pairs(DataStoreManager.Profiles) do
            if profile.IsActive then
                local player = Players:GetPlayerByUserId(userId)
                if player then
                    DataStoreManager:saveProfile(player)
                end
            end
        end
    end
end)
```

### Step 5: Handle Player Events

```lua
function DataStoreManager:initialize()
    -- Player joined
    Players.PlayerAdded:Connect(function(player)
        self:loadProfile(player)
    end)

    -- Player left → save + cleanup
    Players.PlayerRemoving:Connect(function(player)
        self:saveProfile(player)
        self.Profiles[player.UserId] = nil
    end)

    -- Server shutdown → save ทุกคน
    game:BindToClose(function()
        for _, player in ipairs(Players:GetPlayers()) do
            self:saveProfile(player)
        end
    end)
end

-- เริ่มต้น
DataStoreManager:initialize()
```

### Step 6: Client-Side Data Sync

```lua
-- PlayerDataClient.lua (LocalScript, StarterPlayerScripts)
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local LocalPlayer = Players.LocalPlayer
local PlayerData = {} -- Local cache

-- รับข้อมูลจาก server
local function onProfileReceived(profile)
    PlayerData = profile
    print("Client received profile:", profile.level, profile.coins)

    -- อัพเดท UI
    local ui = script.Parent -- หรือ reference ถึง UI
    ui.LevelText.Text = "Lv." .. profile.level
    ui.CoinsText.Text = profile.coins
end

-- Listen for profile updates from server
local function setupDataListeners()
    local remotes = ReplicatedStorage:WaitForChild("Remotes")
    local onProfileRemote = remotes:WaitForChild("OnProfileUpdate")

    onProfileRemote.OnClientEvent:Connect(onProfileReceived)
end

setupDataListeners()
```

---

## Code ตัวอย่าง: การใช้งาน (อัพเดท exp)

```lua
-- ใน GameLogic server script
local function onPlayerKill(player, enemy)
    local profile = DataStoreManager.Profiles[player.UserId]
    if not profile then return end

    -- เพิ่ม exp
    profile.exp = profile.exp + 50

    -- เช็คเลเวลอัพ
    local expNeeded = profile.level * 100
    if profile.exp >= expNeeded then
        profile.exp = profile.exp - expNeeded
        profile.level = profile.level + 1
        print(player.Name, "leveled up to", profile.level)
    end

    -- Update coins
    profile.coins = profile.coins + 10

    -- ส่งให้ client รู้ว่าข้อมูลเปลี่ยน
    DataStoreManager:sendToClient(player, profile)
end
```

---

## ข้อควรระวัง / Pitfalls

### 1. DataStore requests are not instant
`GetAsync` / `SetAsync` ใช้เวลา — ถ้า player ออกเร็วเกิน → ข้อมูลยังไม่ทัน save
**วิธีแก้:** ใช้ `BindToClose` รอให้ save เสร็จก่อน server shutdown

### 2. Request limits
DataStore มี limit ประมาณ 60 requests/minute ต่อ place
ถ้าเกิน → request จะ fail
**วิธีแก้:** ใช้ batching สำหรับ save, ใช้ auto-save ทุก 60 วินาทีแทนที่จะ save ทุกเปลี่ยนแปลง

### 3. ข้อมูลซ้อน (หลาย server)
ถ้า player เข้าเกมจากหลาย device พร้อมกัน → data conflict
**วิธีแก้:** ใช้ session lock (เก็บ timestamp ไว้ใน DataStore + session ID)

```lua
-- Session lock pattern
local sessionLock = data.sessionLock or 0
if os.time() - sessionLock > SESSION_LOCK_DURATION then
    -- ยอมให้ load
else
    -- บอกว่า session กำลัง active อยู่
end
```

### 4. ข้อมูลหายถ้า DataStore down
Roblox DataStore มี downtime บางครั้ง
**วิธีแก้:** ใช้ fallback profile แทนที่จะ error + แจ้ง player

---

## แชร์ต่อ

- **ProfileService module** — มี community module ชื่อ ProfileService ที่จัดการ edge cases ให้หมด (recommended)
- **Metatable for reactivity** — ใช้ metatable ทำให้เปลี่ยนค่า profile แล้ว auto-save ได้เลย
- **Analytics** — track playtime, retention ด้วยข้อมูลที่เก็บ

---

## ข้อมูลเพิ่มเติม

- [DataStore | Roblox Creator Hub](https://create.roblox.com/docs/cloud-services/data-store)
- [DataStore Limits](https://create.roblox.com/docs/cloud-services/data-store#limits)
- [ProfileService (community module)](https://github.com/MadStudioRoblox/ProfileService)