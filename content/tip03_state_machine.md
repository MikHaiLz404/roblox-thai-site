# 💡 Quick Tip: State Machine สำหรับ NPC Behavior

> **Series:** Quick Tips | **Topic:** NPC AI with State Machine  
> **Published:** 2026-05-xx | **Status:** Draft

---

## TL;DR

State Machine คือวิธีจัดการ NPC ให้รู้ว่าตอนนี้กำลัง "ทำอะไร" และเปลี่ยน behavior ตามสถานะ

---

## ปัญหา

NPC ต้องเดินไปหา player เมื่อ player อยู่ใกล้ แต่ถ้า player หนีไปไกล NPC ต้องหยุดไล่ แล้วเดินวนแทน

---

## วิธีทำ

### สร้าง State Machine แบบง่าย

```lua
-- NPCStateMachine.lua
local stateMachine = {
    currentState = "Idle",  -- Idle, Chase, Attack, Patrol
    targetPlayer = nil,
}

local STATES = {
    Idle = {
        enter = function(npc)
            npc.Humanoid:MoveTo(npc.Position)
        end,
        update = function(npc, dt)
            -- หา player ที่ใกล้ที่สุด
            local closest = findClosestPlayer(npc)
            if closest and (closest.Position - npc.Position).Magnitude < 20 then
                stateMachine.currentState = "Chase"
                stateMachine.targetPlayer = closest
            end
        end,
    },
    Chase = {
        enter = function(npc)
            print("NPC: ไล่!")
        end,
        update = function(npc, dt)
            local dist = (stateMachine.targetPlayer.Position - npc.Position).Magnitude
            if dist > 25 then
                stateMachine.currentState = "Idle"
            elseif dist < 5 then
                stateMachine.currentState = "Attack"
            else
                npc.Humanoid:MoveTo(stateMachine.targetPlayer.Position)
            end
        end,
    },
    Attack = {
        enter = function(npc)
            print("NPC: โจมตี!")
        end,
        update = function(npc, dt)
            local dist = (stateMachine.targetPlayer.Position - npc.Position).Magnitude
            if dist > 5 then
                stateMachine.currentState = "Chase"
            end
        end,
    },
}

-- Main loop
local RunService = game:GetService("RunService")

RunService.Heartbeat:Connect(function(dt)
    local state = STATES[stateMachine.currentState]
    if state and state.update then
        state.update(npc, dt)
    end
end)
```

---

## สรุป

- State Machine แบ่ง behavior เป็น states: `Idle`, `Chase`, `Attack`
- แต่ละ state มี `enter()` (เริ่ม state) และ `update()` (ทำงานต่อเนื่อง)
- เปลี่ยน state ได้เมื่อเงื่อนไขเปลี่ยน เช่น ระยะทาง > 25 → กลับไป Idle
- ง่ายต่อการ debug เพราะรู้ว่าตอนนี้ NPC อยู่ state ไหน

---

## ข้อมูลเพิ่มเติม

- [Roblox NPCs](https://developer.roblox.com/en-us/articles/NPCs)
- [Finite State Machine](https://en.wikipedia.org/wiki/Finite-state_machine)

---

*Next Tip: DataStore 101 →*