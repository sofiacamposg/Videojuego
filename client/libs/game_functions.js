/*
 * Collection of functions that will be used in the games
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
    const L1 = obj1.position.x - obj1.halfSize.x;
    const R1 = obj1.position.x + obj1.halfSize.x;
    const T1 = obj1.position.y - obj1.halfSize.y;
    const B1 = obj1.position.y + obj1.halfSize.y;

    const L2 = obj2.position.x - obj2.halfSize.x;
    const R2 = obj2.position.x + obj2.halfSize.x;
    const T2 = obj2.position.y - obj2.halfSize.y;
    const B2 = obj2.position.y + obj2.halfSize.y;

    return (L1 < R2 && R1 > L2 && T1 < B2 && B1 > T2);
}

/*
 * Detect overlap between an attack hitbox and a GameObject
 *
 * Arguments:
 * - hitbox: Plain rect { x, y, width, height } where x,y is the top-left corner
 * - obj: A GameObject with position (center) and halfSize
 *
 * Returns:
 * - true if they overlap, false otherwise
 */
function hitboxOverlap(hitbox, obj) {
    const L1 = hitbox.x;
    const R1 = hitbox.x + hitbox.width;
    const T1 = hitbox.y;
    const B1 = hitbox.y + hitbox.height;

    const L2 = obj.collider.x;
    const R2 = obj.collider.x + obj.collider.width;
    const T2 = obj.collider.y;
    const B2 = obj.collider.y + obj.collider.height;

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
function randomRange(size, start) {  //random del tamaño de la caja
    return Math.floor(Math.random() * size) + ((start === undefined) ? 0 : start);
}

//=======================OUR FUNCTIONS============================
//Handle Mouse Move
export function handleMouseMove(event, canvas) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}
//Is Mouse Over Box
export function isMouseOverBox(mouseX, mouseY, element) {
    return mouseX > element.x - element.w / 2 &&
           mouseX < element.x + element.w / 2 &&
           mouseY > element.y - element.h / 2 &&
           mouseY < element.y + element.h / 2;
}
//Handle Click
export function handleClick(mouseX, mouseY, button, ctx) {
    ctx.font = "25px 'VT323'";

    const w = ctx.measureText(button.text).width;
    const h = 30;

    return mouseX > button.x - w / 2 &&
           mouseX < button.x + w / 2 &&
           mouseY > button.y - h / 2 &&
           mouseY < button.y + h / 2;
}

//Draw Button 
export function drawButton(ctx, button, mouseX, mouseY) {
    ctx.font = "25px 'VT323'";
    ctx.textAlign = "center";

    const textWidth = ctx.measureText(button.text).width;
    const textHeight = 30;

    const left = button.x - textWidth / 2;
    const right = button.x + textWidth / 2;
    const top = button.y - textHeight;
    const bottom = button.y;

    const isHover =
        mouseX > left &&
        mouseX < right &&
        mouseY > top &&
        mouseY < bottom;

    ctx.fillStyle = isHover ? "red" : "white";
    ctx.fillText(button.text, button.x, button.y);

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
