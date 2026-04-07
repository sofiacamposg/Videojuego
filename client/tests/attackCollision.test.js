/**
 * Black-box tests for attack hitbox collision system
 * Run in browser: import this file in a <script type="module"> tag
 * or open the browser console and paste the output.
 *
 * Checklist covered:
 *  [1] boxOverlap checks attack hitbox against all active enemies
 *  [2] Hit registered correctly when overlap detected
 *  [3] Works correctly with multiple enemies simultaneously
 *  [4] Single attack does not hit the same enemy more than once
 *  [5] No false positives when player is not attacking
 */

import { hitboxOverlap } from "../libs/game_functions.js";
import { Vector } from "../libs/Vector.js";
import { PlayerBase } from "../objects/PlayerBase.js";
import { EnemyLion } from "../objects/EnemyLion.js";

// ─── tiny test runner ────────────────────────────────────────────────────────
let passed = 0, failed = 0;
function test(name, fn) {
    try {
        fn();
        console.log(`  ✅ ${name}`);
        passed++;
    } catch (e) {
        console.error(`  ❌ ${name}\n     ${e.message}`);
        failed++;
    }
}
function assert(condition, msg) {
    if (!condition) throw new Error(msg ?? "assertion failed");
}

// ─── helpers ─────────────────────────────────────────────────────────────────

/** Simulate N frames of player.update() so the attack state advances */
function runFrames(player, n) {
    for (let i = 0; i < n; i++) player.update();
}

/** Trigger an attack on the player (same key handler as level1Scene) */
function startAttack(player) {
    if (!player.playeratack) {
        player.playeratack = true;
        player.attackFrames = 0;
        player.hitEnemies.clear();
    }
}

/** Simulate checkAttackHits() logic (mirrors level1Scene implementation) */
function checkAttackHits(player, enemies) {
    if (!player.playeratack || !player.attackHitbox) return;
    enemies.forEach(enemy => {
        if (player.hitEnemies.has(enemy)) return;
        if (hitboxOverlap(player.attackHitbox, enemy)) {
            player.hitEnemies.add(enemy);
        }
    });
}

// ─── test suite ──────────────────────────────────────────────────────────────
console.group("Attack Collision Tests");

// [1] + [2]  attack near enemy → hit registered
test("attack near enemy → hit registered", () => {
    const player = new PlayerBase(new Vector(200, 370));
    player.isOnGround = true;
    player.direction = "right";
    // Enemy just to the right of the player, well within hitbox range
    const enemy = new EnemyLion(new Vector(320, 370));

    startAttack(player);
    runFrames(player, 1);           // let update() call createHitbox()

    assert(player.attackHitbox !== null, "attackHitbox should exist while attacking");
    checkAttackHits(player, [enemy]);
    assert(player.hitEnemies.has(enemy), "enemy should be in hitEnemies after hit");
});

// [2] attack out of range → no hit registered
test("attack out of range → no hit registered", () => {
    const player = new PlayerBase(new Vector(200, 370));
    player.isOnGround = true;
    player.direction = "right";
    // Enemy far to the right, outside hitbox range
    const enemy = new EnemyLion(new Vector(900, 370));

    startAttack(player);
    runFrames(player, 1);

    checkAttackHits(player, [enemy]);
    assert(!player.hitEnemies.has(enemy), "out-of-range enemy should NOT be hit");
});

// [3] single attack with two enemies in range → both register one hit each
test("two enemies in range → both hit once", () => {
    const player = new PlayerBase(new Vector(200, 370));
    player.isOnGround = true;
    player.direction = "right";
    const enemy1 = new EnemyLion(new Vector(310, 370));
    const enemy2 = new EnemyLion(new Vector(340, 370));

    startAttack(player);
    runFrames(player, 1);

    checkAttackHits(player, [enemy1, enemy2]);
    assert(player.hitEnemies.has(enemy1), "enemy1 should be hit");
    assert(player.hitEnemies.has(enemy2), "enemy2 should be hit");
    assert(player.hitEnemies.size === 2, "exactly 2 enemies should be hit");
});

// [4] same attack → enemy not hit twice
test("same attack → enemy not hit twice", () => {
    const player = new PlayerBase(new Vector(200, 370));
    player.isOnGround = true;
    player.direction = "right";
    const enemy = new EnemyLion(new Vector(320, 370));

    startAttack(player);
    runFrames(player, 1);

    // call checkAttackHits multiple times in the same attack swing
    checkAttackHits(player, [enemy]);
    checkAttackHits(player, [enemy]);
    checkAttackHits(player, [enemy]);

    assert(player.hitEnemies.size === 1, "enemy should only be registered once even if called multiple times");
});

// [5] no false positives when player is NOT attacking
test("no false positives when not attacking", () => {
    const player = new PlayerBase(new Vector(200, 370));
    player.isOnGround = true;
    player.direction = "right";
    const enemy = new EnemyLion(new Vector(320, 370));

    // Do NOT start an attack — just run frames normally
    player.isMoving = false;
    runFrames(player, 3);

    assert(player.attackHitbox === null, "attackHitbox should be null when not attacking");
    checkAttackHits(player, [enemy]);
    assert(player.hitEnemies.size === 0, "no hit should be registered when not attacking");
});

// [4b] after attack ends, hitEnemies is cleared for next swing
test("hitEnemies cleared after attack finishes", () => {
    const player = new PlayerBase(new Vector(200, 370));
    player.isOnGround = true;
    player.direction = "right";
    const enemy = new EnemyLion(new Vector(320, 370));

    startAttack(player);
    // Run until attack finishes (attackDuration frames)
    runFrames(player, player.attackDuration + 1);

    assert(!player.playeratack, "attack should be finished");
    assert(player.hitEnemies.size === 0, "hitEnemies should be cleared after attack ends");
});

console.groupEnd();
console.log(`\nResults: ${passed} passed, ${failed} failed`);
