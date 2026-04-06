 **Gladiator**

## _Game Design Document_

Team 6:
 - Daniela Angulo - A01028153
 - Sofia Campos - A01277013
 - Ariel Pulver - A01786822


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

## Technical

---

### *Screens*

-> TITLE SCREEN:
Start Game Button
Settings Button
Exit Button
Background of the Colosseum
Crown ambience audio

SETTINGS:
Master Volume slider
Music On/Off toggle

LOG IN SCREEN:


-> LEVEL SELECT:
Levels advance automatically as you complete them
Only 3 levels, played in sequence (but with variations) within one run

-> GAME SCREEN:
Health bar (top left corner)
Fame bar (top center)
Level timer (top center, next to the fame bar)
Number of remaining enemies (top right corner)
Card selection (Player's Deck)(bottom right corner)

-> PAUSE MENU:
Game pauses
Back button (player keeps playing)
Exit Button (leads to "title screen" (GAME OVER))
Confirm exit (GAME OVER) alert
Exit level button (leads to the beginning of the current level (counts as if the player had lost 1 life, and all the power ups in the "player's deck" the player had used))

-> CARD SELECTION SCREEN (PLAYER´S DECK):
Game pauses
Current player's card are shown facing up
Player selects one
Confirm / Back button 

-> CARD SELECTION SCREEN (RANDOM DECK):
Game pauses
Three cards appear face down
Player selects one
Card description is shown before confirming
Confirm buttom to keep playing

-> FINISHED LEVEL SCREEN:
Game pauses
Current fame, health, power-ups (player's deck) and odds (random deck) window are whown, the switched for the new ones

### *Controls*

The game is a 2D side-scrolling arena (left <-> right)
KEYBOARD:
 - A / Left Arrow → Move left
 - D / Right Arrow → Move right
 - Space → Jump
 - J → Basic attack
 - K → Secondary ability (if the power-up effect has not yet ended and a card is drawn from the random deck (is not permitted to use a powerup from the player's deck if a power-up/punishment from the random deck is in effect))
 - Esc → Pause/menu

### *Mechanics*

-> LIVES SYSTEM:
Player starts with 5 lives per run.
Death resets current level (with variaitions) but keeps "player's deck" powerups until used at desired time and level.
When lives reach 0 → Game Over → full reset.

-> FAME SYSTEM:
Fame increases if the level is completed before the target time.
Higher Fame increases probability of punishment cards appearing.
    -Famous (completed the level under target time): 
        +2 permanent powerups added to run
        +2 punishment cards added to deck pool
    Not-Famous (completed the level over target time): 
        +1 permanent powerup
        +1 punishment card added to deck pool
Higher Fame also increases score.

-> RANDOM DECK EVENT:
At random moment during a level:
Game pauses.
3 cards are shown.
Player selects one.
Level 1 guarantees:
    2 powerups
    1 punishment
Levels 2 and 3:
    Ratio depends on deck composition.

-> LEVEL VARIANTS:
Floor type (sand / rock)
Platform motion (none / horizontal / vertical)
Enemy quantity modifier
Emperor visual variant
NPC color palette

## Database Statistics
The game will collect the following metrics to analyse player behaviour and balance the experience:

| Statistic                | Description                                      |
|--------------------------|--------------------------------------------------|
| Match ID                 | Unique identifier for each run                   |
| Date & Time              | When the run started                             |
| Chosen Archetype         | Type of gladiator selected                       |
| Total Duration           | Total playtime of the run                        |
| Level Reached            | 1, 2, 3, or "Victory"                            |
| Final Fame               | Fame value at the end of the run                 |
| Punishment Cards Applied | Number of imperial setbacks received             |
| Power‑up Cards Selected  | Number of advantages obtained                    |
| Remaining Health         | Combat performance summary                       |
| Total Runs Played        | Accumulated per player                           |
| Total Victories          | Successful runs                                  |
| Total Defeats            | Failed runs                                      |

## _Level Design_

### **Themes**
1. Level 1 — The Hunt
        - Mood: Loud, chaotic, festive. 
        - Objects:
            - Ambient:
                - Roaring crowd in the stands.
                - Light-colored sand floor.
                - Torches on the Colosseum walls.
            - Interactive:
                - Lion.
                - Wounded Lion.
                - Stone platforms with randomized positions.
2. Level 2 — The Peak of the Colosseum
        - Mood: Tense, glorious. The Colosseum at its peak. 
        - Objects:
            - Ambient:
                - Roman flags and banners decorating the Colosseum.
                - Polished rock floor marked from previous combats.
                - Larger and louder crowd than in Level 1
            - Interactive:
                - Enemy warrior
                - Wounded Warrior 
                - Stone platforms with randomized positions
3. Level 3 — The Collapse of the Empire
        - Mood: Dark, desperate, apocalypti- The crowd is scarce and hostile. 
        - Objects:
            - Ambient:
                - Broken columns and rubble across the arena
                - Cracked floor 
                - Blue fire torches 
            - Interactive:
                - Germanic Barbarian
                - Looter 
                - Stone platforms with randomized positions

### **Game Flow**

1. Player enters the title screen and selects Start Game
2. Player selects one of the 3 archetypes (Guerrero, Lancero, Pesado)
3. Level 1 — The Hunt begins
    3.1. Enemy waves from Level 1 start spawning
    3.2. At the halfway point of the level's estimated duration, the game pauses and the Random Deck Event triggers
        - 3 cards are shown face down
        - Player selects one and reads its description before confirming
        - Level 1 guarantees 2 powerups and 1 punishment among the 3 options
    3.3 Player eliminates all enemies to complete the level
    3.4 Time is evaluated:
        - Famous (finished before the target time): +2 permanent powerups added to player deck, +2 punishment cards added to the pool
        - Not Famous (finished after the target time): +1 powerup added to player deck, +1 punishment card added to the pool
4. Level Completed screen shows current fame, health, active cards and new rewards
5. Level 2 — Munus begins
    - Same structure as Level 1
    - Powerup to punishment ratio in the Random Deck Event depends on the player's current deck composition
6. Level Completed screen
7. Level 3 — The Fall begins
    - Same structure, higher difficulty
    - Higher probability of punishment cards in the Random Deck Event if the player's Fame is high
8. If the player completes Level 3 → Victory Screen with final score calculated
9. At any point, if lives reach 0 → Game Over → full run reset

## _Development_

---

### **Abstract classes / Components**

1. BasePhysics
    - BasePlayer: Base class for the player-controlled gladiator. Handles movement, health system, and interactions with enemies and cards
    - BaseEnemy: Base class for all enemy types in the aren- Handles enemy movement, attacks, and damage interaction with the player
    - BaseObject: Represents general objects that exist in the arena environment and may interact with entities

2. BaseObstacle
    - ArenaBarrier: Static barriers or structures that prevent the player from passing
    - ArenaColumn: Decorative or structural columns inside the colosseum that can act as obstacles during combat

3. BaseInteractable
    - PowerUpCards: Cards that provide positive effects or abilities granted by the crowd
    - PunishmentCard: Cards that apply negative effects imposed by the emperor when fame becomes too high

### **Derived Classes / Component Compositions**

1. BasePlayer
    - PlayerGuerrero: Balanced archetype. Sword and shield. HP: 120, Attack: 20, Speed: 5. 
    - PlayerLancero: Aggressive archetype. Spear. HP: 100, Attack: 25, Speed: 6. 
    - PlayerPesado: Tank archetype. Full armor. HP: 150, Attack: 15, Speed: 3. 
2. BaseEnemy
    - EnemyLion: Level 1 main enemy. Fast movement speed, moderate damage.
    - EnemyWoundedLion: Level 1 variant. Slower than the standard lion
    - Enemy_EnemyWarrior: Level 2 main enemy. Attacks from distance. Keeps distance if the player approaches.
    - Enemy_WoundedWarrior: Level 2 variant. Attacks from nearer distance than the eney warrior.
    - EnemyBarbarian: Level 3 main enemy. Large and slow. Delivers a single powerful strike that deals high damage. 
    -. EnemyLooter: Level 3 variant. Fast, difficult to hit consistently
3. BaseProjectile
    - ProjectileSword: Launched by Enemy Warrior and Wounded Warrior.
4. BaseObstacle
    - ArenaPlatformSmall: Small stone platform. Fits 1 character.
    - ArenaPlatformMedium: Medium stone platform. Fits 2 characters.
    - ArenaPlatformLarge: Large stone platform. Fits 3 or more characters. 
5. BaseInteractable
- Power Up Cards:
    - CardFavorDelPueblo: +20% movement speed for the duration of the level.
    - CardFiloDeMarte: +30% damage on basic attacks for the duration of the level.
    - CardBendicionDeVenus: Instantly recovers 1 heart of health.
    - CardRugidoDelLeon: All current enemies are slowed for 5 seconds.
    - CardEscudoDivino: Absorbs the next hit received with no damage taken.
    -. CardSangreDeGladiador: Each enemy kill recovers a small amount of HP
    - CardFuriaDelColiseo: Basic attack gains 30% more area 
    - CardOjoDelEmperador: Reveals the type of cards in the random deck before selection.
    - Punishment cards:
    - CardDecretoImperial: Spawns 2 additional enemies immediately.
    - CardCadenasDelCesar: Disables jumping for 10 seconds.
    - CardHambreDeLaPlebe: Using any card from the player's deck costs ½ heart of health.
    - CardIraDeJupiter: Reduces player fame 5%
    - CardNieblaDelAnfiteatro: Partially darkens the screen for 12 seconds.
    - CardTraicionDelLanista: Reduces player damage by 40% for 15 seconds.
    - CardJuicioDelSenado: If the player dies during this level, 2 lives are lost instead of 1.

## _Graphics_

---

### **Style Attributes**

The game uses a pixel art style, thick dark outlines, and limited shading per tile. Characters are rendered with high contrast against backgrounds to maintain readability during fast-paced combat. 

-> Color Palette
The palette shifts across levels to reflect the narrative arc of Rome:
- Level 1 & 2 use warm tones — sandy yellows, burnt oranges, deep reds and golden highlights
- Level 3 shifts to cold, desaturated tones — dark greys, muted purples and dim greens — reflecting the decay and collapse of the Empire.

UI elements use a consistent dark background with gold, red and white text to maintain thematic cohesion across all screens.

-> Visual Feedback
1. Taking damage: sprite flashes red briefly and is knocked back
2. Dealing damage: hit spark effect appears on the enemy at point of contact
3. Low health: health bar turns red and pulses slowly
4. Fame increasing: gold particle burst above the fame bar
5. Card selected: brief screen freeze + card glow effect before resuming gameplay
6. Punishment card active: a subtle red vignette around the screen edges persists for the duration of the effect
7. Enemy death: sprite plays death animation and fades out
8. Level completed: screen dims briefly, then the level completed UI slides in


### *Graphics Needed*

1. Characters
    - Player Archetypes (idle, walk, basic attack, secondary attack, hurt, death)
        - Guerrero — sword and shield
        - Lancero — spear
        - Pesado — full armor
    - Enemies
        - Level 1 
            - Lion — main type (idle, walk, charge, hurt, death) 
            - Wounded Lion — variant (idle, limp walk, burst attack, death)
        - Level 2 
            - Enemy warrior — main type (idle, walk, net throw, trident attack, hurt, death)
            - Wounded Warrior — variant (idle, walk, combo attack, hurt, death)
        - Level 3
            - Germanic Barbarian — main type (idle, walk, heavy strike, hurt, death) 
            - Looter — variant (idle, fast walk, hit and run, hurt, death)

2. Backgrounds
    - Level 1: warm sandy Colosseum arena with crowded stands 
    - Level 2: same arena with Roman banners, Emperor's box visible 
    - Level 3 : dark decayed Colosseum, broken columns, fire in stands 

3. UI Elements
    - Health bar 
    - Fame bar 
    - Card front design (powerup and punishment variants)
    - Pause menu screen
    - Level completed screen
    -. Game over screen
    - Victory screen

4. Ambient 
    - Sand floor tiles
    - Rock floor tiles
    - Moving platform
    - Imperial throne
    - Crowd background
    -. Gates

## _Sounds/Music_

---

### **Style Attributes**

Music: Orchestral /Roman-inspired percussion, heavy drums and a more dramatic theme to build tension on level 3.
SFX: Realistic metal crashes, crowd cheering and booing, and this audio feedback is louder than ambient music to esure clarity.

### **Sounds Needed**

1. Effects
    - Sword swing
    - Sword hit
    - Shield block
    - Animal roar
    - Crowd cheer
    - Crowd boo
    - Platform movement
    - Card selection flip
    - Powerup activation
    - Punishment activation
    - Landing
    - Gate opening

2. Feedback
    - Extra life gained
    - Life lost
    - Fame increase
    - Game Over sound
    - Victory sound


### **Music Needed**

1. Slow-paced, nerve-racking &quot;forest&quot; track
2. Exciting &quot;castle&quot; track
3. Creepy, slow &quot;dungeon&quot; track
4. Happy ending credits track
5. Rick Astley&#39;s hit #1 single &quot;Never Gonna Give You Up&quot;


## _Schedule_

---

Main activities and the expected dates when they should be finished. This is only a reference, and can change as the project is developed.

1. WEEK 4
    - Finish GDD
    - Begin with the pitch presentation
    - Begin with the DB
2. WEEK 5
    - Implement base movement
    - Implement character and enemy base class
3. WEEK 6
    - Implement Level I
    - Implement deck system
    - Implement lives system
4. WEEK 7
    - Implement Level II
    - Add level variants
    - Implement fame logic
5. WEEK 8 
    - Implement Level III
    - Add score system
    - DB integration
6. WEEK 9 
    - Polish visuals
    - Add sound and music
    - Playtesting and balancing (user view)
