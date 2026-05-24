# 📚 สร้าง State Machine สำหรับ NPC ใน Roblox

## Overview

**TL;DR:** State Machine ช่วยให้ NPC ตัดสินใจได้อย่างเป็นระบบ — แทนที่จะเขียน if-else ยาวเหยียด ใช้ state table + transition rules แทน

**Prerequisites:**
- รู้จัก Lua พื้นฐาน (variables, functions, tables)
- เข้าใจเรื่อง Events (RunService heartbeat)
- มี NPC model ที่มี Humanoid ติดมาแล้ว

---

## ปัญหา

เวลาเขียน NPC behavior แบบ straightforward มักจบลงด้วย if-else ยาวๆ:

```lua
-- ❌ แบบนี้ยากต่อการดูแล
if npc.State == "Idle" then
    -- do idle things
elseif npc.State == "Chase" then
    -- do chase things
elseif npc.State == "Attack" then
    -- do attack things
end
```

พอเพิ่ม state ใหม่ (patrol, flee, death) → code ยาวขึ้นเรื่อยๆ → bug เพิ่มตาม

**State Machine แก้ปัญหานี้ด้วยการ:**
1. แยก "state ตอนนี้" ออกจาก "logic ของแต่ละ state"
2. กำหนด "transition rules" ชัดเจนว่า when → where
3. เพิ่ม state ใหม่ได้โดยไม่ต้องแก้ code เดิม

---

## วิธีทำ

### Step 1: กำหนด States และ Transitions

ก่อนเขียน code ต้องตอบคำถามก่อน:
- NPC มี state อะไรบ้าง?
- แต่ละ state → state ไหนได้บ้าง?
- Condition อะไรที่ทำให้ transition?

```
IDLE ←→ PATROL
  ↓        ↓
CHASE ←→ ATTACK
  ↓
DEATH
```

### Step 2: สร้าง State Table

```lua
-- NPCStateMachine.lua (ServerScriptService)
local RunService = game:GetService("RunService")

local NPCStateMachine = {}
NPCStateMachine.__index = NPCStateMachine

-- State definitions
local States = {
    IDLE = "Idle",
    PATROL = "Patrol",
    CHASE = "Chase",
    ATTACK = "Attack",
    DEATH = "Death",
}

-- Transition rules: [currentState] = {nextState = conditionFunction}
local Transitions = {
    [States.IDLE] = {
        [States.PATROL] = function(npc)
            return npc:hasTarget() and npc:distanceToTarget() > 20
        end,
        [States.CHASE] = function(npc)
            return npc:distanceToTarget() < 15
        end,
    },
    [States.PATROL] = {
        [States.IDLE] = function(npc)
            return npc:patrolComplete()
        end,
        [States.CHASE] = function(npc)
            return npc:distanceToTarget() < 15
        end,
    },
    [States.CHASE] = {
        [States.ATTACK] = function(npc)
            return npc:distanceToTarget() < 3
        end,
        [States.IDLE] = function(npc)
            return not npc:hasTarget()
        end,
    },
    [States.ATTACK] = {
        [States.CHASE] = function(npc)
            return npc:distanceToTarget() > 5
        end,
        [States.DEATH] = function(npc)
            return npc.Health <= 0
        end,
    },
}

function NPCStateMachine.new(npc)
    local self = setmetatable({}, NPCStateMachine)
    self.NPC = npc
    self.CurrentState = States.IDLE
    self.StateData = {} -- เก็บ data เฉพาะของแต่ละ state
    self.IsActive = false
    return self
end
```

### Step 3: สร้าง State Handlers

```lua
-- State behavior functions
local StateHandlers = {
    [States.IDLE] = {
        enter = function(npc, stateData)
            npc:stopMoving()
            npc:playAnimation("idle")
        end,
        update = function(npc, dt)
            -- หันมองรอบๆ ทุกๆ 2 วินาที
            npc.RotationTimer = (npc.RotationTimer or 0) + dt
            if npc.RotationTimer > 2 then
                npc:rotateRandom()
                npc.RotationTimer = 0
            end
        end,
        exit = function(npc)
            npc.RotationTimer = 0
        end,
    },

    [States.PATROL] = {
        enter = function(npc, stateData)
            stateData.currentWaypointIndex = 1
            npc:moveTo(npc:getWaypoint(stateData.currentWaypointIndex))
            npc:playAnimation("walk")
        end,
        update = function(npc, dt)
            -- ถ้าไปถึง waypoint แล้ว → ไป waypoint ถัดไป
            if npc:hasReachedWaypoint() then
                stateData.currentWaypointIndex = stateData.currentWaypointIndex + 1
                if stateData.currentWaypointIndex > npc:getWaypointCount() then
                    stateData.currentWaypointIndex = 1 -- loop กลับ
                end
                npc:moveTo(npc:getWaypoint(stateData.currentWaypointIndex))
            end
        end,
        exit = function(npc)
            npc:stopMoving()
        end,
    },

    [States.CHASE] = {
        enter = function(npc, stateData)
            stateData.lastSeenPosition = npc.TargetPosition
            npc:playAnimation("run")
        end,
        update = function(npc, dt)
            if npc:hasTarget() then
                npc:moveTo(npc.TargetPosition)
                stateData.lastSeenPosition = npc.TargetPosition
            else
                -- ไม่เห็น target แล้ว → follow scent
                npc:moveTo(stateData.lastSeenPosition)
            end
        end,
        exit = function(npc)
            npc:stopMoving()
        end,
    },

    [States.ATTACK] = {
        enter = function(npc, stateData)
            stateData.attackCooldown = 0
            npc:playAnimation("attack")
        end,
        update = function(npc, dt)
            stateData.attackCooldown = math.max(0, stateData.attackCooldown - dt)

            -- จู่โจมเมื่อ cooldown หมด
            if stateData.attackCooldown <= 0 and npc:distanceToTarget() < 3 then
                npc:performAttack()
                stateData.attackCooldown = npc.AttackSpeed or 1
            end

            -- หันหน้าไปที่ target
            npc:lookAt(npc.TargetPosition)
        end,
        exit = function(npc)
            -- เคลียร์ attack state
        end,
    },

    [States.DEATH] = {
        enter = function(npc, stateData)
            npc:stopMoving()
            npc:playAnimation("death")
            npc.NPC.Humanoid:SetStateEnabled(Enum.HumanoidStateType.GettingUp, false)
            -- รอ 3 วินาทีแล้วลบ
            task.delay(3, function()
                npc:destroy()
            end)
        end,
        update = function(npc, dt)
            -- ไม่ต้องทำอะไร
        end,
        exit = function(npc)
            -- ไม่ต้องทำอะไร
        end,
    },
}
```

### Step 4: Main Update Loop

```lua
function NPCStateMachine:start()
    self.IsActive = true

    self.UpdateConnection = RunService.Heartbeat:Connect(function(dt)
        self:update(dt)
    end)
end

function NPCStateMachine:stop()
    self.IsActive = false
    if self.UpdateConnection then
        self.UpdateConnection:Disconnect()
    end
end

function NPCStateMachine:update(dt)
    local currentHandler = StateHandlers[self.CurrentState]
    if currentHandler and currentHandler.update then
        currentHandler.update(self.NPC, dt)
    end

    -- เช็ค transitions
    self:checkTransitions()
end

function NPCStateMachine:checkTransitions()
    local transitions = Transitions[self.CurrentState]
    if not transitions then return end

    for nextState, conditionFn in pairs(transitions) do
        if conditionFn(self.NPC) then
            self:transitionTo(nextState)
            break -- ทำทีละ transition
        end
    end
end

function NPCStateMachine:transitionTo(newState)
    if newState == self.CurrentState then return end

    -- Exit current state
    local currentHandler = StateHandlers[self.CurrentState]
    if currentHandler and currentHandler.exit then
        currentHandler.exit(self.NPC)
    end

    -- Enter new state
    local newHandler = StateHandlers[newState]
    local stateData = self.StateData[newState] or {}
    self.StateData[newState] = stateData

    if newHandler and newHandler.enter then
        newHandler.enter(self.NPC, stateData)
    end

    self.CurrentState = newState
    print("NPC transitioned to:", newState)
end
```

### Step 5: ใช้งานใน NPC Script

```lua
-- NPCController.lua (ServerScriptService)
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local StateMachine = require(script.Parent.NPCStateMachine)

local function setupNPC(npcModel)
    local npc = {
        Model = npcModel,
        Humanoid = npcModel:WaitForChild("Humanoid"),
        Target = nil,
        AttackSpeed = 1.5,
        Waypoints = {}, -- กำหนด patrol points

        -- Helper methods
        hasTarget = function(self)
            return self.Target ~= nil
        end,
        distanceToTarget = function(self)
            if not self.Target then return math.huge end
            local pos = self.Model.PrimaryPart.Position
            local targetPos = self.Target.PrimaryPart.Position
            return (pos - targetPos).Magnitude
        end,
        -- ... อื่นๆ
    }

    local sm = StateMachine.new(npc)
    sm:start()

    return sm
end
```

---

## ข้อควรระวัง / Pitfalls

### 1. State explosion
ถ้ามี N states → transitions อาจเป็น N×(N-1) combinations ซึ่งยากจะ manage
**วิธีแก้:** ใช้ Hierarchical State Machine — state หลัก + sub-states

### 2. Transition loops
ถ้า two states transition to each other → infinite loop
**วิธีแก้:** ใส่ cooldown หรือ minimum duration ก่อน transition ครั้งต่อไป

```lua
-- กำหนด minimum time ในแต่ละ state
local MinStateDuration = {
    [States.ATTACK] = 0.5, -- อย่างน้อย 0.5 วินาที
}
```

### 3. State data not isolated
ถ้าใช้ตัวแปรเดียวกันในหลาย states → data ปนกัน
**วิธีแก้:** ใช้ `self.StateData[stateName]` แยกเก็บ data ของแต่ละ state

---

## แชร์ต่อ

State Machine เป็นแค่จุดเริ่มต้น — ต่อยอดได้หลายแบบ:

- **Threat Level System:** เพิ่ม alert level (calm → suspicious → alert → combat)
- **Animation-Driven States:** ใช้ animation events ตั้ง state แทน update loop
- **Behavior Trees:** ถ้า state machine ซับซ้อนเกินไป → ลอง Behavior Tree แทน

```lua
-- ดูเพิ่มเติม:
-- Behavior Trees = State Machine + hierarchical decision making
-- อ่านเพิ่ม: Roblox Creator Hub > AI Navigation > Behavior Trees
```