# 💡 Quick Tip: RemoteEvents — Client ↔ Server Communication

> **Series:** Quick Tips | **Topic:** Roblox RemoteEvents  
> **Published:** 2026-05-xx | **Status:** Draft

---

## TL;DR

RemoteEvents คือวิธีที่ client กับ server คุยกันใน Roblox อย่างปลอดภัย

---

## ปัญหา

ต้องการให้ผู้เล่นทำ something ที่ server ต้องตรวจสอบ เช่น ได้เหรียญ ใช้ item หรือยิงปืน แต่ถ้าให้ client ควบคุมเองได้เลย จะโดน hack ได้

---

## วิธีทำ

### 1. สร้าง RemoteEvent

ไปที่ `ReplicatedStorage` → สร้าง `RemoteEvent` ตั้งชื่อว่า `GiveCoinsEvent`

### 2. Server — รับ event และตรวจสอบ

```lua
-- ServerScriptService/GiveCoinsServer.lua
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local giveCoinsEvent = ReplicatedStorage:WaitForChild("GiveCoinsEvent")

giveCoinsEvent.OnServerEvent:Connect(function(player, amount)
    -- ตรวจสอบว่า amount ถูกต้อง
    if type(amount) ~= "number" then return end
    if amount < 0 or amount > 1000 then return end
    
    -- ให้เหรียญ
    local leaderstats = player:FindFirstChild("leaderstats")
    if leaderstats then
        local coins = leaderstats:FindFirstChild("Coins")
        if coins then
            coins.Value = coins.Value + amount
        end
    end
end)
```

### 3. Client — ส่ง event

```lua
-- StarterPlayerScripts/GiveCoinsClient.lua
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local giveCoinsEvent = ReplicatedStorage:WaitForChild("GiveCoinsEvent")

-- กดปุ่ม ให้เหรียญ 100
local function onButtonClick()
    giveCoinsEvent:FireServer(100)
end

button.MouseButton1Click:Connect(onButtonClick)
```

---

## สรุป

- `RemoteEvent` อยู่ใน `ReplicatedStorage`
- Client → Server: `RemoteEvent:FireServer(data)`
- Server → Client: `RemoteEvent:FireClient(player, data)`
- **Server ต้องตรวจสอบ data ทุกครั้ง** เพราะ client ส่งอะไรมาก็ได้
- ถ้าต้องการ server → client单向 ใช้ `RemoteFunction` แทนได้

---

## ข้อมูลเพิ่มเติม

- [Roblox RemoteEvents](https://developer.roblox.com/en-us/articles/RemoteEvents)
- [Security in Roblox](https://developer.roblox.com/en-us/articles/Security)

---

*Next Tip: State Machine สำหรับ NPC →*