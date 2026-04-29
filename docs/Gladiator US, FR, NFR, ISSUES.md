### *USER STORIES*


**Authentication & Session Management**


- US-01: User Registration System
  Priority: 1
  Estimated Time: 6h
  Business Value: 300


  Description:
  AS A player
  I WANT TO create a new account
  SO THAT I can access the game and save my progress


  Acceptance Criteria:
  - Username input field rendered on canvas
  - Password input field rendered on canvas
  - Create Account button visible and distinct on logInScene
  - Create createAccountScene similar to logInScene but with name and age fields
  - Input focus switches correctly between fields
  - Keyboard input captured per active field
  - Error message shown if username already exists
  - Form follows existing UI patterns (drawInputBox, drawButton)


- US-02: Authentication API Integration (Register & Login)
  Priority: 1
  Estimated Time: 7h
  Business Value: 300


  Description:
  AS A player
  I WANT TO log in through the API
  SO THAT my account is validated and my session can start with my stored data


  Acceptance Criteria:
  - Username input field rendered on canvas
  - Password input field rendered on canvas
  - Start button visible and distinct on menuScene
  - Create logInScene
  - Button Confirm sends POST /login
  - Empty fields validation before request
  - Successful login → player_id stored in global state + redirect to character selection scene
  - Invalid login → error message displayed


- US-03: API Server Setup
  Priority: 1
  Estimated Time: 5h
  Business Value: 300


  Description:
  AS AN admin
  I WANT TO have a working API server
  SO THAT the frontend can communicate with the database


  Acceptance Criteria:
  - Node.js project initialized
  - Express server running
  - MySQL connection configured via .env
  - Server listens on defined port
  - GET /ping returns 200 OK


- US-04: Database Schema Deployment
  Priority: 1
  Estimated Time: 4h
  Business Value: 300


  Description:
  AS AN admin
  I WANT TO deploy the database schema
  SO THAT all systems have structured data to work with


  Acceptance Criteria:
  - All 9 tables created
  - Seed data inserted (archetypes, levels, cards)
  - Constraints verified (FK, cascade, restrict)
  - Test inserts validate integrity


- US-05: Catalog API Endpoints (GET)
  Priority: 1
  Estimated Time: 4h
  Business Value: 200


  Description:
  AS AN admin
  I WANT the game system to retrieve catalog data
  SO THAT gameplay elements can be loaded dynamically


  Acceptance Criteria:
  - GET /archetypes
  - GET /levels
  - GET /cards
  - GET /enemies
  - GET /player
  - Data returned from SQL views
  - JSON format responses


- US-06: Session Write Endpoints
  Priority: 1
  Estimated Time: 7h
  Business Value: 200


  Description:
  AS AN admin
  I WANT the game system to store gameplay session data
  SO THAT player progress and statistics are saved


  Acceptance Criteria:
  - POST /run
  - PUT /card_deck
  - POST /level-reached
  - POST /card-used
  - POST /score/fame obtained
  - All endpoints validate required fields
  - POST returns inserted ID


- US-07: SQL Views for Catalog & Statistics
  Priority: 2
  Estimated Time: 6h
  Business Value: 200


  Description:
  AS AN admin
  I WANT TO use SQL views
  SO THAT data integrity and statistics are maintained


  Acceptance Criteria:
  - Views for catalog tables
  - View: win rate per archetype
  - View: most used cards
  - View: kill rate per enemy
  - View: avg completion time per level


**Core Gameplay System**


- US-08: Player Horizontal Movement
  Priority: 1
  Estimated Time: 5h
  Business Value: 300


  Description:
  AS A player
  I WANT TO move left and right
  SO THAT I can navigate the arena


  Acceptance Criteria:
  - Left Arrow / A → move left
  - Right Arrow / D → move right
  - Movement stops when key is released
  - Player cannot cross arena boundaries
  - Movement speed is variable type const
  - Movement feels responsive


- US-09: Jump & Gravity System
  Priority: 1
  Estimated Time: 5h
  Business Value: 300


  Description:
  AS A player
  I WANT TO jump
  SO THAT I can avoid enemies and obstacles


  Acceptance Criteria:
  - Space triggers jump
  - Gravity applied every frame
  - Player lands correctly on floor
  - Double jump not allowed
  - Jump arc is smooth


- US-10: Platform Collision System
  Priority: 1
  Estimated Time: 6h
  Business Value: 200


  Description:
  AS A player
  I WANT TO land on platforms
  SO THAT I can navigate vertically


  Acceptance Criteria:
  - Player lands on top of platform
  - Downward movement stops on collision
  - Player walks on platform
  - Player falls off edges naturally
  - Side collisions do NOT teleport player


- US-11: Basic Attack System
  Priority: 1
  Estimated Time: 5h
  Business Value: 300


  Description:
  AS A player
  I WANT TO attack enemies
  SO THAT I can defeat them


  Acceptance Criteria:
  - J triggers attack
  - Attack sprite appears
  - Only one attack active at a time
  - Enemy HP reduced correctly
  - Uses start_damage + modifiers


- US-12: Enemy Death System
  Priority: 1
  Estimated Time: 4h
  Business Value: 300


  Description:
  AS A player
  I WANT TO defeat enemies
  SO THAT I can progress in the level


  Acceptance Criteria:
  - Enemy removed when HP ≤ 0
  - No collision after death
  - Kill counter increases
  - Death handled cleanly (no bugs)


- US-13: Player Damage System
  Priority: 1
  Estimated Time: 3h
  Business Value: 300


  Description:
  AS A player
  I WANT TO receive damage
  SO THAT the game has challenge


  Acceptance Criteria:
  - Enemy contact damages player
  - HP decreases correctly
  - Health bar updates
  - Death triggered at 0 HP


- US-14: Lives System
  Priority: 1
  Estimated Time: 4h
  Business Value: 300


  Description:
  AS A player
  I WANT TO have multiple lives
  SO THAT I can retry the level


  Acceptance Criteria:
  - Start with 5 lives
  - On death → lose 1 life
  - Current level resets
  - HP restored
  - Deck preserved (all unused cards)
  - Lives = 0 → Game Over
  - If Game Over, resets all run and keeps only 1 unused card
  - Power-up card can modify life loss


- US-15: Pause System
  Priority: 2
  Estimated Time: 4h
  Business Value: 200


  Description:
  AS A player
  I WANT TO pause the game
  SO THAT I can control my session


  Acceptance Criteria:
  - ESC pauses current level/run
  - Overlay menu appears
  - Continue resumes game
  - Home triggers Game Over (with confirmation)
  - Restart subtracts life + resets level
  - All timers pause correctly


**Card System**


- US-16: Card Event Trigger System
  Priority: 1
  Estimated Time: 4h
  Business Value: 300


  Description:
  AS A player
  I WANT TO receive card events during each level
  SO THAT gameplay becomes dynamic and strategic


  Acceptance Criteria:
  - Fetch target_time from API at level start
  - Track elapsed time excluding pauses
  - First event triggers at the start of the level (strategic selection — cards shown face up, player chooses freely)
  - Second event triggers at exactly the halfway point of target_time (random selection — cards shown face down, player picks without seeing)
  - Both events fire exactly once per level
  - Game pauses automatically when either event triggers
  - Level 1 only has the mid-level event (no start-of-level event on the first level)


- US-17: Card Selection UI
  Priority: 1
  Estimated Time: 5h
  Business Value: 300


  Description:
  AS A player
  I WANT TO choose between cards
  SO THAT I can influence my run


  Acceptance Criteria:
  - 3 cards displayed centered on canvas
  - Only one card selectable at a time
  - Confirm button appears after selection
  - Back button resets selection
  - Confirm applies card and resumes game
  - Face-up display for strategic event (start of level)
  - Face-down display for random event (mid-level)


- US-18: Card Distribution Logic
  Priority: 1
  Estimated Time: 4h
  Business Value: 200


  Description:
  AS AN admin
  I WANT the game system to generate balanced card options
  SO THAT gameplay remains fair and dynamic


  Acceptance Criteria:
  - Level 1 mid-level event → always 2 powerups + 1 punishment
  - Levels 2–3 → weighted random based on fame
  - Higher fame → higher punishment probability + higher reward for player
  - No duplicate cards in same event
  - No repeated cards within same level


- US-19: Powerup Card Effects
  Priority: 1
  Estimated Time: 6.5h
  Business Value: 300


  Description:
  AS A player
  I WANT TO gain temporary or permanent boosts
  SO THAT I can improve my performance


  Acceptance Criteria:
  - Speed boost applied correctly
  - Damage boost applied correctly
  - Healing works instantly
  - Enemy slow effect works
  - Shield blocks next hit
  - Kill-based healing works
  - AoE attack works
  - Card preview ability works
  - All temporary effects expire cleanly


- US-20: Punishment Card Effects
  Priority: 1
  Estimated Time: 6.5h
  Business Value: 200


  Description:
  AS A player
  I WANT TO face negative effects
  SO THAT the game becomes more challenging


  Acceptance Criteria:
  - Extra enemies spawn correctly
  - Jump disabling works
  - Card usage costs HP
  - Instant HP loss works
  - Screen darkening effect works
  - Damage reduction applied correctly
  - Double-life-loss effect works
  - All effects expire correctly


**Fame and Progression System**


- US-21: Fame Calculation & Rewards
  Priority: 1
  Estimated Time: 5h
  Business Value: 300


  Description:
  AS A player
  I WANT TO receive rewards based on my performance
  SO THAT my gameplay evolves across levels


  Acceptance Criteria:
  - Fetch target_time from API
  - Compare completion time vs target
  - Faster → Famous rewards applied
  - Slower/equal → Not Famous rewards
  - Deck pool updated correctly
  - Result stored in global state
  - POST current_level to API


- US-22: Fame Bar UI
  Priority: 2
  Estimated Time: 2.5h
  Business Value: 100


  Description:
  AS A player
  I WANT TO see my fame progression
  SO THAT I understand my performance


  Acceptance Criteria:
  - Fame bar fills smoothly
  - Reflects current accumulated fame
  - Animation completes before transition
  - No overflow beyond limits


**Website & Presentation Layer**


- US-23: Main Website Layout
  Priority: 2
  Estimated Time: 6.5h
  Business Value: 200


  Description:
  AS A web visitor
  I WANT TO navigate the website
  SO THAT I can explore the game and its content


  Acceptance Criteria:
  - Navigation bar with tabs (Home, Story, Tutorial, Credits)
  - Canvas centered in Home
  - Placeholder content for all sections
  - Roman-themed UI consistent
  - Accessible without login


- US-24: Real-Time Statistics Panel
  Priority: 2
  Estimated Time: 6h
  Business Value: 200


  Description:
  AS A user
  I WANT TO see live game statistics
  SO THAT I understand overall performance trends


  Acceptance Criteria:
  - Panel surrounds canvas without overlap
  - Shows total runs, wins, defeats
  - Shows most used archetype
  - Shows most used card
  - Shows avg completion time
  - Auto-refresh without reload
  - Handles empty state
  - Handles API errors


- US-25: Tutorial & Story Content
  Priority: 3
  Estimated Time: 4h
  Business Value: 100


  Description:
  AS A player
  I WANT TO understand the game
  SO THAT I can play correctly and enjoy the story


  Acceptance Criteria:
  - Controls explained clearly
  - Lives system explained
  - Fame system explained
  - Card system explained
  - Archetypes explained
  - Story per level documented
  - Content matches actual gameplay


---


### *FUNCTIONAL REQUIREMENTS (FR)*
**Authentication**
- FR-01 The system must allow users to register with a username and password.
- FR-02 The system must validate that usernames are unique.
- FR-03 The system must allow users to log in.
- FR-04 The system must display error messages for invalid credentials.


**Gameplay Core**
- FR-05 The player must be able to move left and right.
- FR-06 The player must be able to jump.
- FR-07 The system must apply gravity to the player.
- FR-08 The player must be able to attack enemies.
- FR-09 Enemies must lose HP when attacked.
- FR-10 Enemies must be removed when HP reaches zero.
- FR-11 The player must receive damage from enemies.
- FR-12 The system must track player lives.
- FR-13 The system must reset the level when the player dies.
- FR-14 The system must end the game when lives reach zero.


**Environment & Interaction**
- FR-15 The player must be able to interact with platforms.
- FR-16 The player must collide correctly with game objects.


**Pause System**
- FR-17 The player must be able to pause the game.
- FR-18 The system must display a pause menu.
- FR-19 The player must be able to resume, restart, or exit.


**Cards System**
- FR-20 The system must trigger a card event at the start of each level (from level 2 onwards).
- FR-21 The system must trigger a card event at the halfway point of each level.
- FR-22 The system must display 3 selectable cards per event.
- FR-23 The player must be able to select one card per event.
- FR-24 The system must apply card effects immediately on confirmation.
- FR-25 The system must generate cards based on level and fame.
- FR-26 The system must prevent duplicate cards within the same level.


**Fame System**
- FR-27 The system must calculate player performance after each level.
- FR-28 The system must assign rewards based on performance.
- FR-29 The system must update the player's deck pool.
- FR-30 The system must display a fame bar.


**Backend & Data**
- FR-31 The system must store player session data.
- FR-32 The system must retrieve game data from the database.
- FR-33 The system must expose API endpoints.
- FR-34 The system must validate API requests.


**Web**
- FR-35 The system must display a website with navigation tabs.
- FR-36 The system must display the game canvas.
- FR-37 The system must display real-time statistics.
- FR-38 The system must display tutorial content.
- FR-39 The system must display story content.


---


### *NON-FUNCTIONAL REQUIREMENTS (NFR)*
**Performance**
- NFR-01 The game must run at a stable frame rate (≥ 60 FPS).
- NFR-02 API responses must return within 2 seconds.


**Usability**
- NFR-03 The UI must be clear and intuitive.
- NFR-04 The player must understand controls without external help.
- NFR-05 Error messages must be clear and visible.


**Reliability**
- NFR-06 The system must handle API failures gracefully.
- NFR-07 The game must not crash due to invalid input.
- NFR-08 Game state must remain consistent after pause/resume.


**Security**
- NFR-09 The frontend must not connect directly to the database.
- NFR-10 User credentials must be validated securely.


**Maintainability**
- NFR-11 Code must follow modular structure (scenes, objects, API).
- NFR-12 The system must use reusable UI components.


**Compatibility**
- NFR-13 The game must run in modern web browsers.
- NFR-14 The system must work locally for all team members.


**Data Integrity**
- NFR-15 The API must query SQL views instead of base catalog tables directly to protect original data.
- NFR-16 The system must implement MySQL triggers to automatically update total_runs, total_victorias, and total_derrotas in the Jugador table when a run ends.
- NFR-17 The player's personal card collection must persist between separate runs and separate play sessions.
- NFR-18 All catalog tables (Arquetipo, Nivel, Carta, Enemigo) must be protected through SQL views — no direct writes allowed through views.

