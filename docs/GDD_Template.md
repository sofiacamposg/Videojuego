# **Gladiator**

## _Game Design Document_

---

##### **Copyright notice / author information / boring legal stuff nobody likes**

##
## _Index_

---

1. [Index](#index)
2. [Game Design](#game-design)
    1. [Summary](#summary)
    2. [Gameplay](#gameplay)
    3. [Mindset](#mindset)
3. [Technical](#technical)
    1. [Screens](#screens)
    2. [Controls](#controls)
    3. [Mechanics](#mechanics)
4. [Level Design](#level-design)
    1. [Themes](#themes)
        1. Ambience
        2. Objects
            1. Ambient
            2. Interactive
        3. Challenges
    2. [Game Flow](#game-flow)
5. [Development](#development)
    1. [Abstract Classes](#abstract-classes--components)
    2. [Derived Classes](#derived-classes--component-compositions)
6. [Graphics](#graphics)
    1. [Style Attributes](#style-attributes)
    2. [Graphics Needed](#graphics-needed)
7. [Sounds/Music](#soundsmusic)
    1. [Style Attributes](#style-attributes-1)
    2. [Sounds Needed](#sounds-needed)
    3. [Music Needed](#music-needed)
8. [Schedule](#schedule)

## _Game Design_

---

### **Summary**

Gladiator is a roguelite set in the Roman Colosseum where the player fights through three historical events while managing their growing fame. Each power gained from the crowd increases the risk of imperial punishment, forcing the player to balance glory and survival.

### **Gameplay**

The game is a three-level roguelite arena combat experience inspired by real Roman Colosseum events. The player chooses one of three gladiator archetypes and survives waves of enemies while selecting from a limited deck of 15 cards that provide either powerful advantages or imperial setbacks.

The main goal is to survive all three levels. Obstacles include increasingly difficult enemies, environmental variations such as moving platforms or changing arena floors, and “Imperial Decree” cards that introduce disadvantages as the player’s Fame increases.

To overcome these challenges, players must carefully manage their Fame, choose strategic card combinations, adapt to randomized arena conditions, and decide whether to pursue greater glory or maintain caution. Success depends on tactical positioning and risk control.

### **Mindset**

The game is designed to provoke tension and calculated ambition. Players should feel powerful in combat but constantly aware that success makes them more vulnerable.

The balance between empowerment and threat creates a mindset of strategic caution: the player is tempted by glory but fears the consequences of becoming too popular. Environmental unpredictability and imperial interference generate nervous anticipation, while victories in combat create short bursts of triumph.

The intention is for players to feel both like a rising champion and a disposable pawn within the Roman spectacle.

## _Technical_

---

### **Screens**

TITLE SCREEN:
Start Game Button
Settings Button
Exit Button
Background of the Colosseum
Crown ambience audio

OPTIONS:
Master Volume slider
Music On/Off toggle

LEVEL SELECT:
Levels advance automatically as you complete them
Only 3 levels, played in sequence (but with variations) within one run

GAME SCREEN:
Health bar (top left corner)
Fame bar (top center)
Level timer (top center, next to the fame bar)
Number of remaining enemies (top right corner)
Card selection (Player's Deck)(bottom right corner)

PAUSE MENU:
Game pauses
Back button (player keeps playing)
Exit Button (leads to "title screen" (GAME OVER))
Confirm exit (GAME OVER) alert
Exit level button (leads to the beginning of the current level (counts as if the player had lost 1 life, and all the power ups in the "player's deck" the player had used))

CARD SELECTION SCREEN (PLAYER´S DECK):
Game pauses
Current player's card are shown facing up
Player selects one
Confirm / Back button 

CARD SELECTION SCREEN (RANDOM DECK):
Game pauses
Three cards appear face down
Player selects one
Card description is shown before confirming
Confirm buttom to keep playing

FINISHED LEVEL SCREEN:
Game pauses
Current fame, health, power-ups (player's deck) and odds (random deck) window are whown, the switched for the new ones

### **Controls**

The game is a 2D side-scrolling arena (left <-> right)
KEYBOARD:
A / Left Arrow → Move left
D / Right Arrow → Move right
Space → Jump
J → Basic attack
K → Secondary ability (if the power-up effect has not yet ended and a card is drawn from the random deck (is not permitted to use a powerup from the player's deck if a power-up/punishment from the random deck is in effect))
Esc → Pause menu

### **Mechanics**

LIVES SYSTEM:
Player starts with 5 lives per run.
Death resets current level (with variaitions) but keeps "player's deck" powerups until used at desired time and level.
When lives reach 0 → Game Over → full reset.

FAME SYSTEM:
Fame increases if the level is completed before the target time.
Higher Fame increases probability of punishment cards appearing.
    -Famous (completed the level under target time): 
        +2 permanent powerups added to run
        +2 punishment cards added to deck pool
    Not-Famous (completed the level over target time): 
        +1 permanent powerup
        +1 punishment card added to deck pool
Higher Fame also increases score.

RANDOM DECK EVENT:
At random moment during a level:
Game pauses.
3 cards are shown.
Player selects one.
Level 1 guarantees:
    2 powerups
    1 punishment
Levels 2 and 3:
    Ratio depends on deck composition.

LEVEL VARIANTS:
Floor type (sand / rock)
Platform motion (none / horizontal / vertical)
Enemy quantity modifier
Emperor visual variant
NPC color palette

## _Level Design_
------------PENDIENTE----------
---

_(Note : These sections can safely be skipped if they&#39;re not relevant, or you&#39;d rather go about it another way. For most games, at least one of them should be useful. But I&#39;ll understand if you don&#39;t want to use them. It&#39;ll only hurt my feelings a little bit.)_

### **Themes**
--------PENDIENTE--------------
1. Forest
    1. Mood
        1. Dark, calm, foreboding
    2. Objects
        1. _Ambient_
            1. Fireflies
            2. Beams of moonlight
            3. Tall grass
        2. _Interactive_
            1. Wolves
            2. Goblins
            3. Rocks
2. Castle
    1. Mood
        1. Dangerous, tense, active
    2. Objects
        1. _Ambient_
            1. Rodents
            2. Torches
            3. Suits of armor
        2. _Interactive_
            1. Guards
            2. Giant rats
            3. Chests

_(example)_

### **Game Flow**

1. Player selects charcater
2. Level I begins
3. Random deck event occurs during level
4. Level completed -> Time and score evaluated -> Reward applies
5. Repeat step 4 for level II and III
6. Victory screen
7. Score calculated
8. Game over resets everything if lives reack 0

-(example)-
## _Development_

---

### **Abstract Classes / Components**
---------------PENDIENTE-------------
1. BasePhysics
    1. BasePlayer
    2. BaseEnemy
    3. BaseObject
2. BaseObstacle
3. BaseInteractable

_(example)_

### **Derived Classes / Component Compositions**

1. BasePlayer
    1. PlayerMain
    2. PlayerUnlockable
2. BaseEnemy
    1. EnemyWolf
    2. EnemyGoblin
    3. EnemyGuard (may drop key)
    4. EnemyGiantRat
    5. EnemyPrisoner
3. BaseObject
    1. ObjectRock (pick-up-able, throwable)
    2. ObjectChest (pick-up-able, throwable, spits gold coins with key)
    3. ObjectGoldCoin (cha-ching!)
    4. ObjectKey (pick-up-able, throwable)
4. BaseObstacle
    1. ObstacleWindow (destroyed with rock)
    2. ObstacleWall
    3. ObstacleGate (watches to see if certain buttons are pressed)
5. BaseInteractable
    1. InteractableButton

_(example)_

## _Graphics_

---

### **Style Attributes**

What kinds of colors will you be using? Do you have a limited palette to work with? A post-processed HSV map/image? Consistency is key for immersion.

What kind of graphic style are you going for? Cartoony? Pixel-y? Cute? How, specifically? Solid, thick outlines with flat hues? Non-black outlines with limited tints/shades? Emphasize smooth curvatures over sharp angles? Describe a set of general rules depicting your style here.

Well-designed feedback, both good (e.g. leveling up) and bad (e.g. being hit), are great for teaching the player how to play through trial and error, instead of scripting a lengthy tutorial. What kind of visual feedback are you going to use to let the player know they are interacting with something? That they \*can\* interact with something?

### **Graphics Needed**

1. Characters
    1. Human-like
        1. Goblin (idle, walking, throwing)
        2. Guard (idle, walking, stabbing)
        3. Prisoner (walking, running)
    2. Other
        1. Wolf (idle, walking, running)
        2. Giant Rat (idle, scurrying)
2. Blocks
    1. Dirt
    2. Dirt/Grass
    3. Stone Block
    4. Stone Bricks
    5. Tiled Floor
    6. Weathered Stone Block
    7. Weathered Stone Bricks
3. Ambient
    1. Tall Grass
    2. Rodent (idle, scurrying)
    3. Torch
    4. Armored Suit
    5. Chains (matching Weathered Stone Bricks)
    6. Blood stains (matching Weathered Stone Bricks)
4. Other
    1. Chest
    2. Door (matching Stone Bricks)
    3. Gate
    4. Button (matching Weathered Stone Bricks)

_(example)_

//No quise borrar los ejemplos entonces escribi aquí abajo
1. Characters...
2. Environment
    1. Sand floor tiles
    2. Rock floor tiles
    3. Moving platform
    4. Imperial throne
    5. Crowd background
    6. Gates
3. UI
    1. Health bar
    2. Fame state
    3. Life icons
    4. Card frame (power-up)
    5. Card-frame (punishment)
    6. Pause menu
    7. Victory screen
    8. Game over screen 


## _Sounds/Music_

---

### **Style Attributes**

Music: Orchestral /Roman-inspired percussion, heavy drums and a more dramatic theme to build tension on level 3
SFX: Realistic metal crashes, crowd cheering and booing, and this audio feedback is louder than ambient music to esure clarity



### **Sounds Needed**

1. Effects
    Sword swing
    Sword hit
    Shield block
    Animal roar
    Crowd cheer
    Crowd boo
    Platform movement
    Card selection flip
    Powerup activation
    Punishment activation
    Landing
    Gate opening

2. Feedback
    Extra life gained
    Life lost
    Fame increase
    Game Over sound
    Victory sound

_(example)_

### **Music Needed**

1. Slow-paced, nerve-racking &quot;forest&quot; track
2. Exciting &quot;castle&quot; track
3. Creepy, slow &quot;dungeon&quot; track
4. Happy ending credits track
5. Rick Astley&#39;s hit #1 single &quot;Never Gonna Give You Up&quot;

_(example)_


## _Schedule_

---

_(define the main activities and the expected dates when they should be finished. This is only a reference, and can change as the project is developed)_

1. develop base classes
    1. base entity
        1. base player
        2. base enemy
        3. base block
  2. base app state
        1. game world
        2. menu world
2. develop player and basic block classes
    1. physics / collisions
3. find some smooth controls/physics
4. develop other derived classes
    1. blocks
        1. moving
        2. falling
        3. breaking
        4. cloud
    2. enemies
        1. soldier
        2. rat
        3. etc.
5. design levels
    1. introduce motion/jumping
    2. introduce throwing
    3. mind the pacing, let the player play between lessons
6. design sounds
7. design music

_(example)_

//No quise borrar los ejemplos entonces 
WEEK 4
    Finish GDD
    Begin with the pitch presentation
    Begin with the DB
WEEK 5
    Implement base movement
    Implement character and enemy base class
WEEK 6
    Implement Level I
    Implement deck sstem
    Implement lives system
WEEK 7
    Implement Level II
    Add level variants
    Implement fame logic
WEEK 8 
    Implement Level III
    Add score system
    DB integration
WEEK 9 
    Polish visuals
    Add sounf and music
    Playtesting and balancing (user view)
