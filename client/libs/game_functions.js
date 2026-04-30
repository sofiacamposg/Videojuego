/*
 * Collection of utility functions used across the game
 *
 * Gilberto Echeverria
 * 2026-02-10
 */

"use strict";

/*
 * Detect a collision of two box colliders
 *
 * Arguments:
 * - obj1: A GameObject with position (center) and halfSize
 * - obj2: A GameObject with position (center) and halfSize
 *
 * Returns:
 * - true if the boxes overlap, false otherwise
 */
function boxOverlap(obj1, obj2) {
    // Calculate the edges of each object
    const L1 = obj1.position.x - obj1.halfSize.x; // Left edge of obj1
    const R1 = obj1.position.x + obj1.halfSize.x; // Right edge of obj1
    const T1 = obj1.position.y - obj1.halfSize.y; // Top edge of obj1
    const B1 = obj1.position.y + obj1.halfSize.y; // Bottom edge of obj1

    const L2 = obj2.position.x - obj2.halfSize.x; // Left edge of obj2
    const R2 = obj2.position.x + obj2.halfSize.x; // Right edge of obj2
    const T2 = obj2.position.y - obj2.halfSize.y; // Top edge of obj2
    const B2 = obj2.position.y + obj2.halfSize.y; // Bottom edge of obj2

    // Return true if all 4 overlap conditions are met (AABB collision)
    return (L1 < R2 && R1 > L2 && T1 < B2 && B1 > T2);
}

/*
 * Detect overlap between an attack hitbox and a GameObject
 * Used to check if a player attack or hazard hits an enemy or the player
 *
 * Arguments:
 * - hitbox: Plain rect { x, y, width, height } where x,y is the top-left corner
 * - obj: A GameObject with position (center) and halfSize
 *
 * Returns:
 * - true if they overlap, false otherwise
 */
function hitboxOverlap(hitbox, obj) {
    // Hitbox edges (top-left origin)
    const L1 = hitbox.x;
    const R1 = hitbox.x + hitbox.width;
    const T1 = hitbox.y;
    const B1 = hitbox.y + hitbox.height;

    // Object collider edges
    const L2 = obj.collider.x;
    const R2 = obj.collider.x + obj.collider.width;
    const T2 = obj.collider.y;
    const B2 = obj.collider.y + obj.collider.height;

    // Return true if all 4 overlap conditions are met
    return (L1 < R2 && R1 > L2 && T1 < B2 && B1 > T2);
}

/*
 * Generate a random integer in the range [start, start + size - 1]
 *
 * Arguments:
 * - size: The size of the range (number of possible values)
 * - start: The starting value of the range (default is 0)
 *
 * Returns:
 * - A random integer in the specified range
*/
function randomRange(size, start) {
    // If no start value is provided, default to 0
    return Math.floor(Math.random() * size) + ((start === undefined) ? 0 : start);
}

//=======================OUR FUNCTIONS============================

// Returns the mouse position relative to the canvas (not the whole window)
export function handleMouseMove(event, canvas) {
    const rect = canvas.getBoundingClientRect(); // Get canvas position on screen
    return {
        x: event.clientX - rect.left, // Subtract canvas offset from mouse X
        y: event.clientY - rect.top   // Subtract canvas offset from mouse Y
    };
}

// Returns true if the mouse is hovering over a box element (centered at x, y)
export function isMouseOverBox(mouseX, mouseY, element) {
    return mouseX > element.x - element.w / 2 &&
           mouseX < element.x + element.w / 2 &&
           mouseY > element.y - element.h / 2 &&
           mouseY < element.y + element.h / 2;
}

// Returns true if the mouse clicked inside the button's text bounds
// Uses canvas text measurement to calculate the clickable area dynamically
export function handleClick(mouseX, mouseY, button, ctx) {
    ctx.font = "25px 'VT323'";

    const w = ctx.measureText(button.text).width; // Measure text width for hit area
    const h = 30; // Fixed height for the clickable zone

    return mouseX > button.x - w / 2 &&
           mouseX < button.x + w / 2 &&
           mouseY > button.y - h / 2 &&
           mouseY < button.y + h / 2;
}

// Draws a text button on the canvas
// Changes color to red and adds an underline when the mouse is hovering over it
export function drawButton(ctx, button, mouseX, mouseY) {
    ctx.font = "25px 'VT323'";
    ctx.textAlign = "center";

    const textWidth = ctx.measureText(button.text).width; // Measure text for hover detection
    const textHeight = 30;

    // Calculate button bounds
    const left = button.x - textWidth / 2;
    const right = button.x + textWidth / 2;
    const top = button.y - textHeight;
    const bottom = button.y;

    // Check if the mouse is within the button bounds
    const isHover =
        mouseX > left &&
        mouseX < right &&
        mouseY > top &&
        mouseY < bottom;

    // Change color on hover
    ctx.fillStyle = isHover ? "red" : "white";
    ctx.fillText(button.text, button.x, button.y);

    // Draw underline on hover for visual feedback
    if (isHover) {
        ctx.beginPath();
        ctx.moveTo(left, button.y + 5);
        ctx.lineTo(right, button.y + 5);
        ctx.strokeStyle = "red";
        ctx.lineWidth = 3;
        ctx.stroke();
    }
}

export { boxOverlap, hitboxOverlap, randomRange };