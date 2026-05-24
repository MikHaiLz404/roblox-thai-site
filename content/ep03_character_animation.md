# [EP.03] ระบบตัวละคร + Animation Pipeline

## TL;DR
- ✅ สร้างระบบตัวละครพื้นฐาน (Character Setup) ที่รองรับ both R6 และ R15 rigs
- ✅ เซ็ตอัพ Animation Pipeline ด้วย AnimationController + Animator อย่างถูกต้อง
- 📊 ได้ระบบที่พร้อมใช้งานจริง รองรับทั้ง melee combo และ animation events

## 🔧 ทำอะไร

### 1. Character Setup — รู้จักกับ Rig ใน Roblox

ก่อนจะทำ animation ได้ ต้องเข้าใจโครงสร้างตัวละครใน Roblox ก่อน — Roblox มี rig สองแบบ:

- **R6** — ตัวละครแบบ 6 part (Head, Torso, Left Arm, Right Arm, Left Leg, Right Leg)
- **R15** — ตัวละครแบบ 15 part ที่แยกส่วนได้ละเอียดกว่า (Head, UpperTorso, LowerTorso, RootJoint → HumanoidRootPart ต่อกัน)

สำหรับเกมที่ต้องการ animation ที่หลากหลาย แนะนำใช้ **R15** ค่ะ — ควบคุมได้ละเอียดกว่า และ Roblox ปัจจุบัน default เป็น R15 อยู่แล้ว

```lua
-- CharacterSetup.lua (ServerScriptService)
local Players = game:GetService("Players")

local function onCharacterAdded(character)
    local humanoid = character:WaitForChild("Humanoid")
    local rigType = humanoid.RigType

    print("Character rig type:", rigType.Name) -- R6 or R15

    -- ตั้งค่า walkspeed + jump power
    humanoid.WalkSpeed = 16
    humanoid.JumpPower = 50

    -- รอจนตัวละครโหลดเสร็จ
    local humanoidRootPart = character:WaitForChild("HumanoidRootPart")

    -- เพิ่ม Health bar UI ถ้ายังไม่มี
    local existingUi = character:FindFirstChild("HealthUi")
    if not existingUi then
        local ui = game.ReplicatedStorage.HealthUiTemplate:Clone()
        ui.Adornee = humanoidRootPart
        ui.Parent = character
    end
end

local function onPlayerAdded(player)
    player.CharacterAdded:Connect(onCharacterAdded)

    -- ถ้าตัวละคร spawn มาแล้วก่อนที่จะ connect event
    if player.Character then
        onCharacterAdded(player.Character)
    end
end

Players.PlayerAdded:Connect(onPlayerAdded)
```

### 2. Animation Pipeline — การตั้งค่า AnimationController

Animation ใน Roblox ทำงานผ่านระบบ **AnimationController → Animator → AnimationTrack**:

1. **AnimationController** — ตัวควบคุม (ต่อกับ Humanoid หรือ ตัวละคร)
2. **Animator** — ตัวจัดการ animation clips ที่โหลดเข้ามา
3. **AnimationTrack** — animation clip ที่กำลังเล่นอยู่

```lua
-- AnimationManager.lua (ServerScriptService)
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local AnimationManager = {}
AnimationManager.ActiveTracks = {} -- เก็บ track ที่กำลังเล่น

-- สร้าง Animator สำหรับตัวละคร
function AnimationManager.getAnimator(humanoid)
    -- Roblox สร้าง Animator ให้อัตโนมัติเมื่อ humanoid load
    -- แต่ถ้าต้องการ custom animator ให้ทำแบบนี้:
    local existingAnimator = humanoid:FindFirstChildOfClass("Animator")
    if existingAnimator then
        return existingAnimator
    end

    local animator = Instance.new("Animator")
    animator.Parent = humanoid
    return animator
end

-- Load animation clip
function AnimationManager.loadAnimation(humanoid, animationId)
    local animator = AnimationManager.getAnimator(humanoid)

    local animation = Instance.new("Animation")
    animation.Id = animationId

    local track = animator:LoadAnimation(animation)
    track.Priority = Enum.AnimationPriority.Action

    return track
end

-- เล่น animation พร้อม blend
function AnimationManager.playAnimation(humanoid, animationId, fadeTime, weight)
    local track = AnimationManager.loadAnimation(humanoid, animationId)
    fadeTime = fadeTime or 0.1
    weight = weight or 1

    track:FadeIn(fadeTime)
    track:AdjustWeight(weight)

    return track
end

-- หยุด animation อย่างนุ่มนวล
function AnimationManager.stopAnimation(track, fadeTime)
    fadeTime = fadeTime or 0.1
    track:FadeOut(fadeTime)
end

-- จัดการ melee combo animations
function AnimationManager.playCombo(humanoid, comboTracks)
    -- comboTracks = array ของ animation IDs
    local currentTrack = nil

    for i, animId in ipairs(comboTracks) do
        local track = AnimationManager.loadAnimation(humanoid, animId)
        track.Priority = Enum.AnimationPriority.Action

        if currentTrack then
            -- รอให้ animation ก่อนจบ 0.1 วินาที แล้วเล่นต่อ
            currentTrack.Stopped:Connect(function()
                task.delay(0.1, function()
                    track:Play(0.1, 1, 1)
                end)
            end)
        else
            track:Play(0.1, 1, 1)
        end

        currentTrack = track
    end

    return currentTrack
end

return AnimationManager
```

### 3. Animation Events — ทำให้ Animation ยิง Signal

เวลา animation เล่น บางครั้งต้องการให้ animation ยิง event เพื่อจังหวะการโจมตี การเปิด UI ฯลฯ — ใช้ **AnimationKeyframeSignal**

```lua
-- AnimationEvents.lua (LocalScript, StarterPlayerScripts)
local Players = game:GetService("Players")
local player = Players.LocalPlayer

local function setupAnimationEvents(character)
    local humanoid = character:WaitForChild("Humanoid")
    local animator = humanoid:FindFirstChildOfClass("Animator")

    if not animator then return end

    -- รอให้ animation load เสร็จ
    local runService = game:GetService("RunService")

    -- ตัวอย่าง: เมื่อ animation "slash" จบ ให้ทำ damage
    local function onAnimationInterrupted(track)
        -- animation ถูก interrupt ด้วย animation ใหม่
        print("Animation interrupted:", track.Animation.AnimationId)
    end

    -- ฟัง animation event markers
    local function onMarkerReached(markerName)
        print("Animation marker reached:", markerName)

        if markerName == "HitFrame" then
            -- จังหวะที่ weapon ชน target
            local events = ReplicatedStorage:FindFirstChild("Events")
            if events then
                events.Remotes.PerformAttack:FireServer()
            end
        elseif markerName == "Footstep" then
            -- จังหวะเหยียบเท้า → play footstep sound
            local sound = Instance.new("Sound")
            sound.SoundId = "rbxassetid://123456789"
            sound.Parent = character:FindFirstChild("HumanoidRootPart")
            sound:Play()
            task.delay(1, function() sound:Destroy() end)
        end
    end

    -- Monitor active tracks for markers
    humanoid.AnimationPlayed:Connect(function(track)
        -- เช็คว่า track มี markers ไหม
        local animId = track.Animation.AnimationId

        -- วิธีหา markers คือต้องใส่ keyframe markers ใน Roblox Studio
        -- ตัวอย่างนี้เป็น pattern ที่จะดักจับ markers ที่ใส่ไว้ใน animation
        for _, marker in ipairs(track:GetKeyframeMarkers()) do
            local connection
            connection = track:GetMarkerReachedSignal(marker):Connect(function()
                onMarkerReached(marker)
            end)
        end
    end)
end

-- Connect เมื่อตัวละคร spawn
local player = Players.LocalPlayer
player.CharacterAdded:Connect(setupAnimationEvents)
if player.Character then
    setupAnimationEvents(player.Character)
end
```

### 4. การตั้งค่า Animation Properties — Blend Speed + Events

```lua
-- Advanced Animation Control
local function configureAnimationTrack(track, config)
    -- Smooth transition เมื่อเปลี่ยน animation
    track.AlignAnimationWithPhysics = true

    -- ใส่ fade in/out time
    track:Play(config.fadeIn or 0.1, config.fadeOut or 0.1)

    -- Looping animations (idle, walk, run)
    if config.loop then
        track.Looped = true
    else
        track.Looped = false
    end

    -- Speed adjustment (slow motion, speed up)
    track:AdjustSpeed(config.speed or 1)

    -- Weight (crossfade between animations)
    if config.weight then
        track:AdjustWeight(config.weight)
    end
end

-- ตัวอย่าง: เล่น idle animation ด้วย blend
local idleTrack = AnimationManager.loadAnimation(humanoid, "rbxassetid://IDLE_ANIM")
idleTrack.Looped = true
idleTrack:Play(0.3) -- 0.3 วินาที fade in

-- ค่อยๆ ไป crossfade เป็น walk animation เมื่อเดิน
local walkTrack = AnimationManager.loadAnimation(humanoid, "rbxassetid://WALK_ANIM")
walkTrack.Looped = true

-- เมื่อ player เดิน: fade out idle, fade in walk
task.spawn(function()
    idleTrack:AdjustWeight(0) -- ค่อยๆ ลด idle
    walkTrack:Play(0.2, 1, 1)  -- ค่อยๆ เพิ่ม walk
end)
```

## 🎯 สิ่งที่ได้เรียนรู้

### 1. RigType สำคัญกว่าที่คิด
ตอนแรกคิดว่า Roblox จะ handle rig difference ให้อัตโนมัติ แต่จริงๆ แล้วถ้า animation ไม่ match กับ rig type → animation จะกระตุก หรือไม่เล่นเลย ต้อง export animation ให้ตรงกับ rig type ที่ใช้เสมอ

### 2. Animator instance — มีแค่ตัวเดียวต่อ Humanoid
Humanoid สร้าง Animator instance ให้อัตโนมัติตอนที่ load เข้ามา ถ้าจะ custom behavior ต้องหา Animator ที่มีอยู่แล้วก่อน อย่าสร้างซ้ำ — จะทำให้ animation ซ้อนกัน

### 3. AnimationPriority มีผลกับ blend behavior
- **Idle** → Action (crossfade ได้เลย)
- **Action** → Core (hard swap ไม่ crossfade)
- **Movement** → ต้องเซ็ต blend ให้นุ่มนวล

### 4. Keyframe markers ช่วยให้ sync ระหว่าง animation กับ logic ได้แม่นยำ
ใส่ "HitFrame" marker ใน animation clip ที่ Roblox Studio → ตอน animation เล่นถึงจุดนั้นจะยิง signal → จังหวะตีแม่นยำ ไม่ต้อง guess

## 🤔 ปัญหาที่เจอ + วิธีแก้

### Problem 1: R15 animation ไม่เล่นบน R6 rig
**สาเหตุ:** Export animation จาก R15 rig ไปใส่ R6 character
**วิธีแก้:** เช็ค `humanoid.RigType.Name` ก่อน load animation ถ้าไม่ตรงกัน → ใช้ fallback animation หรือ convert rig ก่อน

```lua
if humanoid.RigType == Enum.HumanoidRigType.R6 then
    -- ใช้ R6 animations
else
    -- ใช้ R15 animations
end
```

### Problem 2: Animation เล่นซ้อนกัน (stacking)
**สาเหตุ:** หลาย animation เล่นพร้อมกันโดยไม่ stop ตัวเดิมก่อน
**วิธีแก้:** ใช้ dictionary เก็บ active tracks และ stop ก่อนเล่นใหม่เสมอ

```lua
function AnimationManager.stopAllTracks(humanoid)
    local animator = humanoid:FindFirstChildOfClass("Animator")
    if not animator then return end

    for _, track in ipairs(animator:GetPlayingAnimationTracks()) do
        track:Stop(0.1)
    end
end
```

### Problem 3: Animation กระตุกตอน crossfade
**สาเหตุ:** Fade time นานเกินไป หรือ weight blending ไม่ smooth
**วิธีแก้:** ใช้ fadeTime = 0.1-0.2 วินาที และ `AlignAnimationWithPhysics = true` เพื่อ physics-based blending

## 📅 สัปดาห์หน้าจะทำอะไร

1. **ผสม Animation Events เข้ากับ Combat System** — ใช้ HitFrame markers ที่วางไว้ใน EP3 นี้ ทำให้ attack ใน EP7 จังหวะตรง
2. **เพิ่ม Face Animation** — ทำ expression ตัวละครตอน idle, attack, hurt
3. **เขียน Tut01: State Machine สำหรับ NPC** — ระบบ state ของ NPC ที่ใช้ animation เป็นตัวบอก state (idle, walk, attack, hurt, dead)
4. **Refactor AnimationManager** — รวมเป็น module เดียวกับ CombatManager เพื่อลด coupling

## 📚 Links

- [Roblox Animation System](https://create.roblox.com/docs/animation/index)
- [AnimationController | Roblox Creator Hub](https://create.roblox.com/docs/reference/engine/classes/AnimationController)
- [AnimationTrack | Roblox API Reference](https://create.roblox.com/docs/reference/engine/classes/AnimationTrack)
- [Keyframe Markers | Roblox Docs](https://create.roblox.com/docs/animation/markers)