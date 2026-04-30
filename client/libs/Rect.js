//& Rect.js
//& Simple rectangle data class used throughout the game for colliders,
//& spritesheet frames, and hitbox definitions

"use strict";

//* stores the position and dimensions of a rectangle
//* used as colliders, spritesheet rects, and hitboxes across all game objects
class Rect {
    constructor(x, y, width, height) {
        this.x = x;          // left edge of the rectangle
        this.y = y;          // top edge of the rectangle
        this.width = width;  // horizontal size
        this.height = height; // vertical size
    }
}
export { Rect };