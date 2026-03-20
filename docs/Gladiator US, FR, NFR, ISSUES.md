Terminado
Faltante

USER STORIES

Authentication & Session Management

US-01: User Registration System
Priority: 1
Estimated Time: 6h


Description
AS A player
I WANT TO create a new account 
SO THAT I can access the game and save my progress
Acceptance Criteria
Username input field rendered on canvas


Password input field rendered on canvas


Create Account button visible and distinct on logInScene
Create createAccountScene similar to logInScene but with name and age fields


Input focus switches correctly between fields


Keyboard input captured per active field


Error message shown if username already exists 
Form follows existing UI patterns (drawInputBox, drawButton)
US-02: Authentication API Integration (Register & Login)
 Priority: 1
 Estimated Time: 7h
Description
AS A player
 I WANT TO log in through the API
 SO THAT my account is validated and my session can start with my stored data
Acceptance Criteria
Username input field rendered on canvas


Password input field rendered on canvas


Start button visible and distinct on menuScene
Create logInScene
Button Confirm sends POST /log in


Empty fields validation before request


Successful login → player_id stored in global state + redirect to character selection scene


Invalid login → error message displayed
Backend API & Database
US-03: API Server Setup
 Priority: 1
 Estimated Time: 5h
 Sprint: 
Description
AS A developer
 I WANT TO have a working API server
 SO THAT the frontend can communicate with the database, set up Node.js + Express server connected to MySQL using environment variables.
Acceptance Criteria
Node.js project initialized


Express server running


MySQL connection configured via .env


Server listens on defined port


GET /ping returns 200 OK

US-04: Database Schema Deployment
 Priority: 1
 Estimated Time: 4h


Description
AS A developer
 I WANT TO deploy the database schema
 SO THAT all systems have structured data to work with
Acceptance Criteria
All 9 tables created


Seed data inserted (archetypes, levels, cards)


Constraints verified (FK, cascade, restrict)


Test inserts validate integrity


US-05: Catalog API Endpoints (GET)
 Priority: 1
 Estimated Time: 4h


Description
AS A developer
 I WANT the game system to retrieve catalog data
 SO THAT gameplay elements can be loaded dynamically
 Acceptance Criteria
GET /archetypes


GET /levels


GET /cards


GET /enemies
GET/player


Data returned from SQL views


JSON format responses
 US-06: Session Write Endpoints
Priority: 1
 Estimated Time: 7h
Description
AS A developer
 I WANT the game system to store gameplay session data
 SO THAT player progress and statistics are saved
Acceptance Criteria
POST /run


PUT /card_deck


POST /level-reached


POST /card-used


POST /score/fame obtained
POST /b


All endpoints validate required fields


POST returns inserted ID
 US-07: SQL Views for Catalog & Statistics
Priority: 2
 Estimated Time: 6h


Description
AS A developer
 I WANT TO use SQL views
 SO THAT data integrity and statistics are maintained
Acceptance Criteria
Views for catalog tables


View: win rate per archetype


View: most used cards


View: kill rate per enemy


View: avg completion time per level
CORE GAMEPLAY SYSTEM
US-08: Player Horizontal Movement
Priority: 1
 Estimated Time: 5h
 Sprint: 
Description
AS A player
 I WANT TO move left and right
 SO THAT I can navigate the arena
Description
Implement smooth horizontal movement with arrow keys, respecting arena boundaries.
Acceptance Criteria
Left Arrow → move left


Right Arrow → move right


Movement stops when key is released


Player cannot cross arena boundaries


Movement speed is variable type const


Movement feels responsive


US-09: Jump & Gravity System
Priority: 1
 Estimated Time: 5h
 Sprint: 
Description
AS A player
 I WANT TO jump
 SO THAT I can avoid enemies and obstacles
Description
Implement vertical physics with jump and gravity. 
Acceptance Criteria
Space triggers jump


Gravity applied every frame


Player lands correctly on floor


Double jump allowed (easter egg)


Jump arc is smooth


US-10: Platform Collision System
Priority: 1
 Estimated Time: 6h
User Story
AS A player
 I WANT TO land on platforms
 SO THAT I can navigate vertically
Description
Detect top collisions and allow walking across platforms.
Acceptance Criteria
Player lands on top of platform


Downward movement stops on collision


Player walks on platform


Player falls off edges naturally


Side collisions do NOT teleport player


 US-11: Basic Attack System
Priority: 1
 Estimated Time: 5h
 Sprint: 
Description
AS A player
 I WANT TO attack enemies
 SO THAT I can defeat them
Acceptance Criteria
J triggers attack


Attack sprite appears


Only one attack active at a time


Enemy HP reduced correctly


Uses start_damage + modifiers


🟣 US-12: Enemy Death System
Priority: 1
 Estimated Time: 4h
Description

 AS A player
 I WANT TO defeat enemies
 SO THAT I can progress in the level
Acceptance Criteria
Enemy removed when HP ≤ 0


No collision after death


Kill counter increases


Death handled cleanly (no bugs)


US-13: Player Damage System
Priority: 1
 Estimated Time: 3h
 Sprint: 
User Story
AS A player
 I WANT TO receive damage
 SO THAT the game has challenge
Acceptance Criteria
Enemy contact damages player


HP decreases correctly


Health bar updates


Death triggered at 0 HP


US-14: Lives System
Priority: 1
 Estimated Time: 4h
Description
AS A player
 I WANT TO have multiple lives
 SO THAT I can retry the level
Acceptance Criteria
Start with 5 lives


On death → lose 1 life


Current level resets


HP restored


Deck preserved (all unused cards)


Lives = 0 → Game Over
If Game Over, resets all run and keeps only 1 unused card


Power-up card can modify life loss


US-15: Pause System
Priority: 2
 Estimated Time: 4h
Description
AS A player
 I WANT TO pause the game
 SO THAT I can control my session
Acceptance Criteria
ESC pauses current level/run


Overlay menu appears


Continue resumes game


Home triggers Game Over (with confirmation)


Restart subtracts life + resets level


All timers pause correctly
CARD SYSTEM 
US-16: Card Event Trigger System
Priority: 1
 Estimated Time: 4h

 Description
AS A player
 I WANT TO receive a card event mid-level
 SO THAT gameplay becomes dynamic and strategic
Acceptance Criteria
Fetch target_time from API at level start


Track elapsed time excluding pauses


Trigger event at random < target_time
Event fires ONLY once per level


Game pauses automatically when triggered


US-17: Card Selection UI
Priority: 1
 Estimated Time: 5h


Description
AS A player
 I WANT TO choose between cards
 SO THAT I can influence my run
Display 3 selectable cards with confirmation logic.
Acceptance Criteria
3 cards displayed centered on canvas


Only one card selectable at a time


Confirm button appears after selection


Back button resets selection


Confirm applies card and resumes game


US-18: Card Distribution Logic
Priority: 1
 Estimated Time: 4h
 Sprint: 4
User Story
AS Adeveloper
 I WANT the game system to generate balanced card options
 SO THAT gameplay remains fair and dynamic
Description
Control which cards appear depending on level and fame.
Acceptance Criteria
Level 1 → always 2 powerups + 1 punishment


Level 2–3 → weighted random based on fame


Higher fame → higher punishment probability + higher reward for player


No duplicate cards in same event


No repeated cards within same level


US-19: Powerup Card Effects
Priority: 1
 Estimated Time: 6.5h
Description
AS A player
 I WANT TO gain temporary or permanent boosts
 SO THAT I can improve my performance
Implement all 8 powerups with stacking and duration logic.
Acceptance Criteria
Speed boost applied correctly


Damage boost applied correctly


Healing works instantly


Enemy slow effect works


Shield blocks next hit


Kill-based healing works


AoE attack works


Card preview ability works


All temporary effects expire cleanly


US-20: Punishment Card Effects
Priority: 1
 Estimated Time: 6.5h

 Description
AS A player
 I WANT TO face negative effects
 SO THAT the game becomes more challenging
Acceptance Criteria
Extra enemies spawn correctly


Jump disabling works


Card usage costs HP


Instant HP loss works


Screen darkening effect works


Damage reduction applied correctly


Double-life-loss effect works


All effects expire correctly

FAME AND PROGRESSION SYSTEM
 US-21: Fame Calculation & Rewards
Priority: 1
 Estimated Time: 5h
 Sprint: 5
Description
AS A player
 I WANT TO receive rewards based on my performance
 SO THAT my gameplay evolves across levels
Acceptance Criteria
Fetch target_time from API


Compare completion time vs target


Faster → Famous rewards applied


Slower/equal → Not Famous rewards


Deck pool updated correctly


Result stored in global state


POST current_level to API


 US-22: Fame Bar UI
Priority: 2
 Estimated Time: 2.5h
Description
AS A player
 I WANT TO see my fame progression
 SO THAT I understand my performance
Description
Animate fame bar after level completion.
Acceptance Criteria
Fame bar fills smoothly


Reflects current accumulated fame


Animation completes before transition


No overflow beyond limits


Website & Presentation Layer
US-23: Main Website Layout
Priority: 2
 Estimated Time: 6.5h

 Description
AS A web visitor
 I WANT TO navigate the website
 SO THAT I can explore the game and its content.
Acceptance Criteria
Navigation bar with tabs (Home, Story, Tutorial, Credits)


Canvas centered in Home


Placeholder content for all sections


Roman-themed UI consistent


Accessible without login


US-24: Real-Time Statistics Panel
Priority: 2
 Estimated Time: 6h
 Sprint: 6
Description
AS A user
 I WANT TO see live game statistics
 SO THAT I understand overall performance trends
Acceptance Criteria
Panel surrounds canvas without overlap


Shows total runs, wins, defeats


Shows most used archetype


Shows most used card


Shows avg completion time


Auto-refresh without reload


Handles empty state


Handles API errors


US-25: Tutorial & Story Content
Priority: 3
 Estimated Time: 4h
 Sprint: 6
Description
AS A player
 I WANT TO understand the game
 SO THAT I can play correctly and enjoy the story
Acceptance Criteria
Controls explained clearly


Lives system explained


Fame system explained


Card system explained


Archetypes explained


Story per level documented


Content matches actual gameplay

FUNCTIONAL REQUIREMENTS (FR)
Authentication
FR-01 The system must allow users to register with a username and password
 FR-02 The system must validate that usernames are unique
 FR-03 The system must allow users to log in
 FR-04 The system must display error messages for invalid credentials
Gameplay Core
FR-05 The player must be able to move left and right
 FR-06 The player must be able to jump
 FR-07 The system must apply gravity to the player
 FR-08 The player must be able to attack enemies
 FR-09 Enemies must lose HP when attacked
 FR-10 Enemies must be removed when HP reaches zero
 FR-11 The player must receive damage from enemies
 FR-12 The system must track player lives
 FR-13 The system must reset the level when the player dies
 FR-14 The system must end the game when lives reach zero

Environment & Interaction
FR-15 The player must be able to interact with platforms
 FR-16 The player must collide correctly with game objects
Pause System
FR-17 The player must be able to pause the game
 FR-18 The system must display a pause menu
 FR-19 The player must be able to resume, restart, or exit
Cards System
FR-20 The system must trigger a card event mid-level
 FR-21 The system must display 3 selectable cards
 FR-22 The player must be able to select one card
 FR-23 The system must apply card effects
 FR-24 The system must generate cards based on level and fame
 FR-25 The system must prevent duplicate cards in a level
Fame System
FR-26 The system must calculate player performance after each level
 FR-27 The system must assign rewards based on performance
 FR-28 The system must update the player's deck pool
 FR-29 The system must display a fame bar
Backend & Data
FR-30 The system must store player session data
 FR-31 The system must retrieve game data from the database
 FR-32 The system must expose API endpoints
 FR-33 The system must validate API requests
 Web
FR-34 The system must display a website with navigation tabs
 FR-35 The system must display the game canvas
 FR-36 The system must display real-time statistics
 FR-37 The system must display tutorial content
 FR-38 The system must display story content
NON-FUNCTIONAL REQUIREMENTS (NFR)
Performance
NFR-01 The game must run at a stable frame rate (≥ 30 FPS)
 NFR-02 API responses must return within 2 seconds
Usability
NFR-03 The UI must be clear and intuitive
 NFR-04 The player must understand controls without external help
 NFR-05 Error messages must be clear and visible
Reliability
NFR-06 The system must handle API failures gracefully
 NFR-07 The game must not crash due to invalid input
 NFR-08 Game state must remain consistent after pause/resume
Security
NFR-09 The frontend must not connect directly to the database
 NFR-10 User credentials must be validated securely
Maintainability
NFR-11 Code must follow modular structure (scenes, objects, API)
 NFR-12 The system must use reusable UI components (MessageBase, etc.)
 Compatibility
NFR-13 The game must run in modern web browsers
 NFR-14 The system must work locally for all team members


ISSUES
“During early sprints, we will use mocked/local data to simulate backend behavior, and later replaced it with real API integration.”
SPRINT 1 – FRONTEND + BASIC GAME (NO BACKEND)
 Issue 1: [frontend] Render login inputs
🚀 Technical Description
 Draw username and password input boxes on canvas using existing UI patterns (drawInputBox). Ensure both fields are visible and properly aligned.
🚀 Associated Software
 JavaScript (Canvas)
🚀 Ideal Candidate
 Sofi
🚀 Time Estimate
 2h
🚀 Notes
 Restriction: Must follow existing UI patterns used in logInScene.js
🚀 Checklist
Username input box rendered


Password input box rendered


Inputs aligned correctly


Inputs visible on canvas
Issue 2: [frontend] Handle input typing and focus
🚀 Technical Description
 Implement logic to detect which input field is active and capture keyboard input accordingly. Only the selected input should receive typed characters.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Dani
🚀 Time Estimate
 2.5h
🚀 Notes
 Restriction: Only one input field can be active at a time
🚀 Checklist
Clicking username activates it


Clicking password activates it


Typing updates active field


Switching fields works correctly
Issue 3: [frontend] Implement login button interaction
🚀 Technical Description
 Create a login button and detect click events. The button must trigger validation logic when clicked.
🚀 Associated Software
 JavaScript (Canvas)
🚀 Ideal Candidate
 Ariel
🚀 Time Estimate
 1.5h
🚀 Checklist
Button rendered


Click detection works


Button visually distinct


Click triggers function


 Issue 4: [frontend] Mock login validation
🚀 Technical Description
 Implement a temporary login validation using hardcoded credentials (e.g., username: "test", password: "1234"). Display success or error message.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Sofi
🚀 Time Estimate
 2h
🚀 Notes
 Limitation: Temporary logic until API is implemented
🚀 Checklist
Hardcoded credentials checked


Success message displayed


Error message displayed


No API call used
Issue 5: [gameplay] Implement left and right movement
🚀 Technical Description
 Add keyboard controls (A/D or arrow keys) to move the player horizontally.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Dani
🚀 Time Estimate
 3h
🚀 Checklist
A moves left


D moves right


Arrow keys work


Movement responsive
Issue 6: [gameplay] Add movement boundaries
🚀 Technical Description
 Prevent the player from moving outside the arena limits.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Ariel
🚀 Time Estimate
 2h
🚀 Checklist
Left boundary enforced


Right boundary enforced


Player stops at edges


 Issue 7: [gameplay] Smooth movement handling
🚀 Technical Description
 Ensure movement stops immediately when key is released and feels smooth during continuous input.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Sofi
🚀 Time Estimate
 2h
🚀 Checklist
Movement stops on key release


No jittering


Smooth transitions
Issue 8: [gameplay] Implement jump trigger
🚀 Technical Description
 Trigger jump when Space key is pressed by applying initial upward velocity.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Dani
🚀 Time Estimate
 2h
🚀 Checklist
Space triggers jump


Upward velocity applied


Jump starts correctly


Issue 9: [gameplay] Apply gravity system
🚀 Technical Description
 Apply gravity force every frame to bring the player back down after jumping.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Ariel
🚀 Time Estimate
 2h
🚀 Checklist
Gravity applied each frame


Player falls naturally


Landing detected
 Issue 10: [gameplay] Prevent double jump
🚀 Technical Description
 Ensure the player cannot jump again while already in the air.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Sofi
🚀 Time Estimate
 1.5h
🚀 Checklist
Jump disabled mid-air


Jump re-enabled on landing
 Issue 11: [frontend] Setup gameScene structure
🚀 Technical Description
 Create the base structure for gameScene including update loop and render function.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Sofi
🚀 Time Estimate
 2h
🚀 Checklist
Scene initialized


Update loop created


Render function working
Issue 12: [frontend] Implement scene switching
🚀 Technical Description
 Create logic to switch between scenes (login → gameScene).
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Dani
🚀 Time Estimate
 2h
🚀 Checklist
Scene changes correctly


No crashes during switch


Previous scene stops rendering
Issue 13: [frontend] Render player idle sprite
🚀 Technical Description
 Display player sprite in idle state when no input is detected.
🚀 Associated Software
 JavaScript (Canvas)
🚀 Ideal Candidate
 Ariel
🚀 Time Estimate
 2h
🚀 Checklist
Idle sprite displayed


No animation when idle


Correct positioning
SPRINT 2 – COMBAT + ENEMIES (NO BACKEND)
Issue 14: [gameplay] Create enemy base object
🚀 Technical Description
 Define the base enemy object structure including position, HP, damage, and basic properties.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Ariel
🚀 Time Estimate
 2h
🚀 Checklist
Enemy object created


Properties defined (HP, damage, position)


Object reusable for multiple enemies
 Issue 15: [gameplay] Render enemy sprites
🚀 Technical Description
 Draw enemy sprites on canvas and ensure they appear correctly in the scene.
🚀 Associated Software
 JavaScript (Canvas)
🚀 Ideal Candidate
 Sofi
🚀 Time Estimate
 2h
🚀 Checklist
Enemy sprite rendered


Correct position


Multiple enemies supported


Issue 16: [gameplay] Implement enemy basic movement
🚀 Technical Description
 Add simple enemy movement (e.g., patrol or static with slight movement).
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Dani
🚀 Time Estimate
 3h
🚀 Checklist
Enemy moves or animates


Movement consistent


No erratic behavior


Issue 17: [gameplay] Implement attack trigger (J key)
🚀 Technical Description
 Detect when player presses J and trigger attack state.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Dani
🚀 Time Estimate
 2h
🚀 Checklist
J key detected


Attack state triggered


Cannot spam attack


Issue 18: [gameplay] Create attack hitbox
🚀 Technical Description
 Generate a temporary hitbox in front of the player during attack.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Ariel
🚀 Time Estimate
 3h
🚀 Checklist
Hitbox appears in front


Direction matches player


Hitbox disappears after attack


Issue 19: [gameplay] Detect hitbox collision with enemies
🚀 Technical Description
 Check if attack hitbox overlaps with any enemy.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Dani
🚀 Time Estimate
 3h
🚀 Checklist
Collision detected correctly


Works with multiple enemies


No false positives


Issue 20: [gameplay] Apply damage to enemies
🚀 Technical Description
 Reduce enemy HP when hit by player attack.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Sofi
🚀 Time Estimate
 2h
🚀 Checklist
HP reduced on hit


Correct damage value applied


No damage when out of range


Issue 21: [gameplay] Implement enemy death removal
🚀 Technical Description
 Remove enemy from array when HP reaches zero.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Ariel
🚀 Time Estimate
 2h
🚀 Checklist
Enemy removed when HP ≤ 0


No further rendering


No further collision


Issue 22: [gameplay] Create player hitbox
🚀 Technical Description
 Define a collision box for the player to detect enemy attacks.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Sofi
🚀 Time Estimate
 2h
🚀 Checklist
Hitbox matches player size


Updates with movement


Issue 23: [gameplay] Implement enemy attack hitbox
🚀 Technical Description
 Create attack area for enemies to damage the player.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Dani
🚀 Time Estimate
 2h
🚀 Checklist
Enemy hitbox created


Triggered during attack


Correct positioning


Issue 24: [gameplay] Detect enemy attack collision
🚀 Technical Description
 Check overlap between enemy hitbox and player.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Ariel
🚀 Time Estimate
 2h
🚀 Checklist
Collision detected


Works reliably


No multiple triggers per frame


Issue 25: [gameplay] Apply damage to player
🚀 Technical Description
 Reduce player HP when hit by enemy.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Sofi
🚀 Time Estimate
 2h
🚀 Checklist
HP reduced


Correct damage applied


Damage only when hit


Issue 26: [frontend] Implement player health bar UI
🚀 Technical Description
 Display player HP visually using a health bar or hearts.
🚀 Associated Software
 JavaScript (Canvas)
🚀 Ideal Candidate
 Sofi
🚀 Time Estimate
 2.5h
🚀 Checklist
Health bar visible


Updates on damage


Clear to user


Issue 27: [gameplay] Add enemy spawn system
🚀 Technical Description
 Spawn enemies at predefined or random positions in the level.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Dani
🚀 Time Estimate
 2h
🚀 Checklist
Enemies spawn correctly


Multiple enemies supported


No overlapping spawn issues


Issue 28: [gameplay] Basic enemy count tracking
🚀 Technical Description
 Track how many enemies remain alive in the level.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Ariel
🚀 Time Estimate
 1.5h
🚀 Checklist
Count decreases on death


Accurate tracking


Accessible globally


SPRINT 3 – GAME LOOP (LIVES, PAUSE, RESET)
Issue 29: [gameplay] Initialize player lives system
🚀 Technical Description
 Create a system to initialize and store player lives at the start of a run (default = 5).
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Ariel
🚀 Time Estimate
 2h
🚀 Checklist
Lives variable initialized


Default value set to 5


Accessible globally


Issue 30: [gameplay] Detect player death
🚀 Technical Description
 Trigger death logic when player HP reaches zero.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Dani
🚀 Time Estimate
 2h
🚀 Checklist
Detect HP ≤ 0


Trigger death state


Prevent further input


Issue 31: [gameplay] Subtract life on death
🚀 Technical Description
 Reduce player lives by 1 when death occurs.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Sofi
🚀 Time Estimate
 1.5h
🚀 Checklist
Lives decrease correctly


No negative values


Only triggers once per death


Issue 32: [gameplay] Reset level on death
🚀 Technical Description
 Reset level state after player death while keeping remaining lives.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Dani
🚀 Time Estimate
 3h
🚀 Checklist
Player position reset


Enemies respawn


State cleared correctly


Issue 33: [gameplay] Restore player HP on respawn
🚀 Technical Description
 Restore player HP to full after death.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Ariel
🚀 Time Estimate
 1.5h
🚀 Checklist
HP reset to max


Health UI updated


Issue 34: [gameplay] Implement Game Over condition
🚀 Technical Description
 End the run when player lives reach zero.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Sofi
🚀 Time Estimate
 2h
🚀 Checklist
Lives = 0 triggers Game Over


Gameplay stops


Transition to game over state


Issue 35: [frontend] Create Game Over screen
🚀 Technical Description
 Display a Game Over screen with message and restart option.
🚀 Associated Software
 JavaScript (Canvas)
🚀 Ideal Candidate
 Sofi
🚀 Time Estimate
 2.5h
🚀 Checklist
Message displayed


Restart option visible


UI clear and centered


Issue 36: [frontend] Implement restart button logic
🚀 Technical Description
 Allow player to restart game from Game Over screen.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Dani
🚀 Time Estimate
 2h
🚀 Checklist
Restart resets lives


Game restarts correctly


No leftover state


Issue 37: [gameplay] Implement pause toggle (ESC key)
🚀 Technical Description
 Pause and resume the game using ESC key.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Ariel
🚀 Time Estimate
 2h
🚀 Checklist
ESC toggles pause


Game loop stops


Game loop resumes


Issue 38: [frontend] Render pause menu overlay
🚀 Technical Description
 Display pause menu with options (Continue, Restart, Exit).
🚀 Associated Software
 JavaScript (Canvas)
🚀 Ideal Candidate
 Sofi
🚀 Time Estimate
 2.5h
🚀 Checklist
Overlay visible


Options displayed


Does not break game rendering


Issue 39: [frontend] Implement pause menu buttons
🚀 Technical Description
 Add interaction logic for pause menu buttons.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Dani
🚀 Time Estimate
 2.5h
🚀 Checklist
Continue resumes game


Restart resets level


Exit returns to menu


Issue 40: [gameplay] Freeze game state during pause
🚀 Technical Description
 Ensure all game logic stops when paused (movement, enemies, timers).
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Ariel
🚀 Time Estimate
 2h
🚀 Checklist
Player stops moving


Enemies stop


No updates during pause


Issue 41: [gameplay] Implement basic level completion condition
🚀 Technical Description
 Detect when all enemies are defeated and trigger level completion.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Dani
🚀 Time Estimate
 2h
🚀 Checklist
Enemy count = 0 triggers completion


Game stops


Transition starts


Issue 42: [frontend] Create level complete UI
🚀 Technical Description
 Display a simple level complete message and continue button.
🚀 Associated Software
 JavaScript (Canvas)
🚀 Ideal Candidate
 Sofi
🚀 Time Estimate
 2h
🚀 Checklist
Message visible


Continue button shown


UI clear


Issue 43: [frontend] Implement next level transition
🚀 Technical Description
 Move player to next level after completion.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Ariel
🚀 Time Estimate
 2h
🚀 Checklist
Scene changes


State resets correctly


No bugs between levels


SPRINT 4 – CARDS SYSTEM (LOCAL)
Issue 44: [gameplay] Create card base object
🚀 Technical Description
 Define a base card object structure including type (powerup/punishment), name, effect, and duration.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Ariel
🚀 Time Estimate
 2h
🚀 Checklist
Card object created


Properties defined (type, effect, duration)


Reusable structure


Issue 45: [gameplay] Create local card pool
🚀 Technical Description
 Define an array of all available cards (8 powerups and 7 punishments) with hardcoded values.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Dani
🚀 Time Estimate
 2.5h
🚀 Checklist
8 powerups created


7 punishments created


All stored in array


No duplicates


Issue 46: [gameplay] Track level elapsed time
🚀 Technical Description
 Implement a timer to track how long the player has been in the level.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Ariel
🚀 Time Estimate
 2h
🚀 Checklist
Timer starts on level start


Timer updates each frame


Accessible globally


Issue 47: [gameplay] Trigger card event at midpoint
🚀 Technical Description
 Trigger card selection event when elapsed time reaches half of the level duration.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Dani
🚀 Time Estimate
 2.5h
🚀 Checklist
Midpoint detected


Event triggers once


Game pauses automatically


Issue 48: [frontend] Create card selection overlay
🚀 Technical Description
 Display a centered overlay showing 3 cards and UI elements.
🚀 Associated Software
 JavaScript (Canvas)
🚀 Ideal Candidate
 Sofi
🚀 Time Estimate
 3h
🚀 Checklist
Overlay visible


Centered on screen


Background dimmed


Issue 49: [frontend] Render 3 selectable cards
🚀 Technical Description
 Display 3 cards visually with front face and basic info.
🚀 Associated Software
 JavaScript (Canvas)
🚀 Ideal Candidate
 Sofi
🚀 Time Estimate
 3h
🚀 Checklist
3 cards rendered


Proper spacing


Readable info


Issue 50: [frontend] Implement card selection logic
🚀 Technical Description
 Allow player to click and select one card at a time.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Dani
🚀 Time Estimate
 2.5h
🚀 Checklist
Only one card selectable


Selected card highlighted


Selection changes correctly


Issue 51: [frontend] Implement confirm button
🚀 Technical Description
 Add confirm button that applies selected card.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Ariel
🚀 Time Estimate
 2h
🚀 Checklist
Button appears after selection


Click applies card


Closes overlay


Issue 52: [frontend] Implement back/reset selection
🚀 Technical Description
 Allow player to deselect card and choose again.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Sofi
🚀 Time Estimate
 2h
🚀 Checklist
Back button works


Selection cleared


Cards reselectable


Issue 53: [gameplay] Implement card distribution logic (Level 1)
🚀 Technical Description
 Ensure Level 1 always shows 2 powerups and 1 punishment randomly.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Dani
🚀 Time Estimate
 2.5h
🚀 Checklist
2 powerups selected


1 punishment selected


Random selection works


Issue 54: [gameplay] Prevent duplicate cards in event
🚀 Technical Description
 Ensure the same card cannot appear twice in a selection.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Ariel
🚀 Time Estimate
 2h
🚀 Checklist
No duplicates in selection


Unique cards enforced


Issue 55: [gameplay] Create active effects system
🚀 Technical Description
 Create a structure to track all active card effects during gameplay.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Ariel
🚀 Time Estimate
 3h
🚀 Checklist
Effects stored in object


Supports stacking


Accessible globally


Issue 56: [gameplay] Implement basic powerup effects
🚀 Technical Description
 Implement core positive effects (speed, damage, heal).
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Dani
🚀 Time Estimate
 3h
🚀 Checklist
Speed boost works


Damage boost works


Heal applies instantly


Issue 57: [gameplay] Implement basic punishment effects
🚀 Technical Description
 Implement core negative effects (damage reduction, HP loss, restrictions).
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Sofi
🚀 Time Estimate
 3h
🚀 Checklist
Damage reduction works


HP loss applied


Restrictions applied


Issue 58: [gameplay] Resume game after card selection
🚀 Technical Description
 Resume gameplay after selecting and applying a card.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Dani
🚀 Time Estimate
 2h
🚀 Checklist
Game unpauses


State restored correctly


No bugs after resume
SPRINT 5 – BACKEND + FAME SYSTEM
Issue 59: [database] Deploy database schema
🚀 Technical Description
 Execute the SQL schema to create all required tables and relationships in MySQL, including seed data for archetypes, levels, and cards.
🚀 Associated Software
 MySQL
🚀 Ideal Candidate
 Esteban
🚀 Time Estimate
 3.5h
🚀 Checklist
Tables created


Relationships working


Seed data inserted


Constraints verified


Issue 60: [API] Initialize Node.js + Express server
🚀 Technical Description
 Set up a Node.js project with Express to act as API layer between frontend and database.
🚀 Associated Software
 JavaScript (Node.js, Express)
🚀 Ideal Candidate
 José / Dani
🚀 Time Estimate
 4h
🚀 Checklist
Server runs locally


Express configured


JSON handling enabled


Issue 61: [API] Configure MySQL connection
🚀 Technical Description
 Connect API server to MySQL database using environment variables.
🚀 Associated Software
 Node.js + MySQL
🚀 Ideal Candidate
 Esteban
🚀 Time Estimate
 3h
🚀 Checklist
DB connection established


Uses .env variables


Handles connection errors


Issue 62: [API] Implement authentication endpoints
🚀 Technical Description
 Create POST /register and POST /login endpoints to handle user authentication.
🚀 Associated Software
 Node.js + Express
🚀 Ideal Candidate
 José
🚀 Time Estimate
 4h
🚀 Checklist
/register inserts user


/login validates credentials


Returns user ID


Error handling included


Issue 63: [frontend] Replace mock login with API integration
🚀 Technical Description
 Replace hardcoded login logic with real API calls to authentication endpoints.
🚀 Associated Software
 JavaScript (Frontend + API)
🚀 Ideal Candidate
 Sofi
🚀 Time Estimate
 3h
🚀 Checklist
Fetch POST request works


Success response handled


Error messages displayed


Issue 64: [API] Implement GET catalog endpoints
🚀 Technical Description
 Create endpoints to retrieve archetypes, levels, enemies, and cards.
🚀 Associated Software
 Node.js + MySQL
🚀 Ideal Candidate
 Esteban
🚀 Time Estimate
 3.5h
🚀 Checklist
GET /arquetipos works


GET /niveles works


GET /cartas works


GET /enemigos works


Issue 65: [frontend] Fetch game data from API
🚀 Technical Description
 Load archetypes, levels, and cards dynamically from API instead of hardcoded values.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Dani
🚀 Time Estimate
 3h
🚀 Checklist
Data fetched correctly


Stored in game state


No hardcoded data remains


Issue 66: [gameplay] Implement fame calculation logic
🚀 Technical Description
 Compare player completion time against target time to determine fame result.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Ariel
🚀 Time Estimate
 3h
🚀 Checklist
Time comparison works


Famous vs Not Famous determined


Logic accurate


Issue 67: [gameplay] Implement fame reward system
🚀 Technical Description
 Apply rewards based on fame result (modify deck pool).
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Dani
🚀 Time Estimate
 3h
🚀 Checklist
Famous rewards applied


Not Famous rewards applied


Deck pool updated


Issue 68: [frontend] Create fame bar UI
🚀 Technical Description
 Display a visual fame bar that reflects player progression.
🚀 Associated Software
 JavaScript (Canvas)
🚀 Ideal Candidate
 Sofi
🚀 Time Estimate
 2.5h
🚀 Checklist
Bar visible


Updates correctly


Scales properly


Issue 69: [frontend] Animate fame bar
🚀 Technical Description
 Add smooth animation to fame bar when it updates.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Ariel
🚀 Time Estimate
 2h
🚀 Checklist
Smooth animation


No visual glitches


Matches new value


Issue 70: [API] Implement POST run endpoints
🚀 Technical Description
 Create endpoints to store run data (partida, nivel, cartas, enemigos).
🚀 Associated Software
 Node.js + MySQL
🚀 Ideal Candidate
 Esteban
🚀 Time Estimate
 4h
🚀 Checklist
POST /partida works


POST /nivel-especifico works


POST /carta-usada works


POST /enemigo-usado works


Issue 71: [frontend] Send run data to API
🚀 Technical Description
 Send gameplay data to backend during and after runs.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 José
🚀 Time Estimate
 3h
🚀 Checklist
Data sent correctly


IDs handled properly


No data loss


Issue 72: [database] Create SQL views
🚀 Technical Description
 Create views for safe querying and statistics aggregation.
🚀 Associated Software
 MySQL
🚀 Ideal Candidate
 Esteban
🚀 Time Estimate
 4h
🚀 Checklist
Views created


Aggregations correct


Query tested


Issue 73: [API] Connect API to SQL views
🚀 Technical Description
 Modify API endpoints to use SQL views instead of base tables.
🚀 Associated Software
 Node.js + MySQL
🚀 Ideal Candidate
 Esteban
🚀 Time Estimate
 2.5h
🚀 Checklist
API uses views


Data consistent


Queries optimized

SPRINT 6 – WEB + STATS + FINAL INTEGRATION
 Issue 74: [web] Create main website structure
🚀 Technical Description
 Build the main HTML structure with a centered game canvas and navigation tabs (Home, Story, Tutorial, Credits).
🚀 Associated Software
 HTML, CSS, JavaScript
🚀 Ideal Candidate
 José
🚀 Time Estimate
 3h
🚀 Checklist
Navigation bar created


Canvas centered


Sections defined


Layout responsive


Issue 75: [web] Implement tab navigation logic
🚀 Technical Description
 Allow switching between Home, Story, Tutorial, and Credits sections dynamically.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Dani
🚀 Time Estimate
 2h
🚀 Checklist
Tabs clickable


Correct content displayed


No page reload needed


Issue 76: [web] Style website with consistent theme
🚀 Technical Description
 Apply CSS styling consistent with Roman/pixel-art theme of the game.
🚀 Associated Software
 CSS
🚀 Ideal Candidate
 Sofi
🚀 Time Estimate
 3h
🚀 Checklist
Consistent colors


Fonts applied


UI clean and readable


Issue 77: [web] Embed game canvas into website
🚀 Technical Description
 Integrate the existing game canvas into the Home section of the website.
🚀 Associated Software
 JavaScript, HTML
🚀 Ideal Candidate
 Ariel
🚀 Time Estimate
 2h
🚀 Checklist
Canvas visible


Game runs correctly


No layout break


Issue 78: [web] Create statistics panel layout
🚀 Technical Description
 Design a panel around the canvas to display game statistics.
🚀 Associated Software
 HTML, CSS
🚀 Ideal Candidate
 José
🚀 Time Estimate
 3h
🚀 Checklist
Panel positioned correctly


Does not overlap canvas


Space for all stats


Issue 79: [web] Fetch statistics from API
🚀 Technical Description
 Retrieve statistics data from API endpoints using fetch.
🚀 Associated Software
 JavaScript, API
🚀 Ideal Candidate
 Dani
🚀 Time Estimate
 2.5h
🚀 Checklist
API call works


Data received correctly


Error handling included


Issue 80: [web] Display real-time statistics
🚀 Technical Description
 Render statistics such as total runs, wins, losses, and averages on the panel.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Sofi
🚀 Time Estimate
 3h
🚀 Checklist
Data displayed correctly


Values update


Clear formatting


Issue 81: [web] Implement auto-refresh for statistics
🚀 Technical Description
 Automatically update statistics panel without reloading the page.
🚀 Associated Software
 JavaScript
🚀 Ideal Candidate
 Ariel
🚀 Time Estimate
 2h
🚀 Checklist
Auto-refresh works


No performance issues


Data stays consistent


Issue 82: [web] Write tutorial content
🚀 Technical Description
 Create and format tutorial explaining controls, mechanics, and systems.
🚀 Associated Software
 HTML, CSS
🚀 Ideal Candidate
 Sofi
🚀 Time Estimate
 2.5h
🚀 Checklist
Controls explained


Systems explained


Easy to understand


Issue 83: [web] Write story content
🚀 Technical Description
 Create story section describing game context and levels.
🚀 Associated Software
 HTML, CSS
🚀 Ideal Candidate
 José
🚀 Time Estimate
 2h
🚀 Checklist
Story written


Matches game theme


Clear narrative


Issue 84: [web] Create credits section
🚀 Technical Description
 Display team members and roles in the credits tab.
🚀 Associated Software
 HTML, CSS
🚀 Ideal Candidate
 Dani
🚀 Time Estimate
 1.5h
🚀 Checklist
Names displayed


Roles defined


Clean layout


Issue 85: [integration] Connect all systems end-to-end
🚀 Technical Description
 Ensure frontend, gameplay, API, and database work together seamlessly.
🚀 Associated Software
 Full Stack
🚀 Ideal Candidate
 All team
🚀 Time Estimate
 4h
🚀 Checklist
Login works


Game runs


Data saved


Stats update


Issue 86: [testing] Perform full system testing
🚀 Technical Description
 Test all features including gameplay, API, and UI to detect bugs.
🚀 Associated Software
 Full Stack
🚀 Ideal Candidate
 All team
🚀 Time Estimate
 3h
🚀 Checklist
Gameplay tested


API tested


UI tested


Bugs identified


Issue 87: [testing] Fix critical bugs
🚀 Technical Description
 Resolve major bugs found during testing phase.
🚀 Associated Software
 Full Stack
🚀 Ideal Candidate
 All team
🚀 Time Estimate
 4h
🚀 Checklist
Critical bugs fixed


Game stable


No crashes


Issue 88: [polish] Improve UX and visual feedback
🚀 Technical Description
 Enhance animations, feedback messages, and overall user experience.
🚀 Associated Software
 JavaScript, CSS
🚀 Ideal Candidate
 Sofi
🚀 Time Estimate
 3h
🚀 Checklist
Smooth transitions


Clear feedback


Better visuals



