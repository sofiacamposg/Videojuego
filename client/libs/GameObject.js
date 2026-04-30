"use strict";
// Base class for all actors in the scene (player, enemies, hazards, etc.)
import { Vector } from "./Vector.js";
import { Rect } from "./Rect.js";

// Global variables to toggle bounding boxes and colliders for debugging
let showBBox = false;
let showColl = false;

// Press 'y' to toggle bounding box display, 'u' to toggle collider display
window.addEventListener('keydown', event => {
    if (event.key == 'y') showBBox = !showBBox;
    if (event.key == 'u') showColl = !showColl;
});

class GameObject {
    constructor(position, width, height, color, type) {
        this.position = position;       // Center position of the object (Vector)
        this.size = new Vector(width, height);          // Full size of the object
        this.halfSize = new Vector(width / 2, height / 2); // Half size for easier calculations
        this.color = color;             // Fallback color if no sprite is set
        this.type = type;               // Object type identifier (e.g. "player", "enemy")
        // Default scale for all new objects
        this.scale = 1.0;

        // Sprite properties — set via setSprite() or directly in subclasses
        this.spriteImage = undefined;
        this.spriteRect = undefined;

        // Initialize a collider with the default object size
        this.setCollider(width, height);
    }

    // Load a sprite image from a path and optionally set a spritesheet rect
    setSprite(imagePath, rect) {
        this.spriteImage = new Image();
        this.spriteImage.src = imagePath;
        if (rect) {
            this.spriteRect = rect; // Only set if a rect is provided (spritesheet)
        }
    }

    // Update the scale of the object (affects drawing and collider size)
    setScale(scale) {
        this.scale = scale;
    }

    // Define the collider size — the hitbox used for collision detection
    setCollider(width, height) {
        // The collider dimensions are scaled with the object's scale
        this.colliderWidth = width * this.scale;
        this.colliderHeight = height * this.scale;
        this.updateCollider(); // Immediately position the collider
    }

    // Recalculate the collider position based on the object's current position
    // The collider is anchored at the feet (toes to head alignment)
    updateCollider() {
        this.collider = new Rect(
            this.position.x - this.colliderWidth / 2,   // Centered horizontally
            this.position.y - this.colliderHeight,       // Anchored at the bottom (feet)
            this.colliderWidth,
            this.colliderHeight
        );
    }

    // Draw the object on the canvas
    // Uses spritesheet if spriteRect is set, full image if not, or a colored rect as fallback
    draw(ctx) {
        if (this.spriteImage) {
            if (this.spriteRect) {
                // Draw a specific frame from a spritesheet
                ctx.drawImage(this.spriteImage,
                              // Source coordinates within the spritesheet
                              this.spriteRect.x,
                              this.spriteRect.y,
                              this.spriteRect.width,
                              this.spriteRect.height,
                              // Destination on canvas (toes to head)
                              (this.position.x - this.halfSize.x * this.scale),
                              (this.position.y - this.size.y * this.scale),
                              this.size.x * this.scale,
                              this.size.y * this.scale);
            } else {
                // Draw the full image without a spritesheet rect
                ctx.drawImage(this.spriteImage,
                              (this.position.x - this.halfSize.x * this.scale),
                              (this.position.y - this.size.y * this.scale),
                              this.size.x * this.scale,
                              this.size.y * this.scale);
            }
        } else {
            // No sprite — draw a plain colored rectangle as fallback
            ctx.fillStyle = this.color;
            ctx.fillRect((this.position.x - this.halfSize.x * this.scale),
                         (this.position.y - this.size.y * this.scale),
                         this.size.x * this.scale,
                         this.size.y * this.scale);
        }

        // Draw debug overlays if enabled
        if (showBBox) this.drawBoundingBox(ctx);
        if (showColl) this.drawCollider(ctx);
    }

    // Draw a semi-transparent overlay and red border showing the object's bounding box
    // Used for debugging — toggle with 'y' key
    drawBoundingBox(ctx) {
        // Use screen blend mode to lighten the image instead of covering it
        ctx.globalCompositeOperation = "screen";
        ctx.fillStyle = "rgb(0.5, 0.5, 0.5, 0.3)";
        ctx.fillRect((this.position.x - this.halfSize.x * this.scale),
                     (this.position.y - this.size.y * this.scale),
                     this.size.x * this.scale,
                     this.size.y * this.scale);
        // Reset to default blend mode
        ctx.globalCompositeOperation = "source-over";

        // Draw red border around the bounding box
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.rect((this.position.x - this.halfSize.x * this.scale),
                 (this.position.y - this.size.y * this.scale),
                 this.size.x * this.scale,
                 this.size.y * this.scale);
        ctx.stroke();

        // Draw a small red dot at the object's center position
        ctx.fillStyle = "red";
        ctx.fillRect(this.position.x - 2, this.position.y - 2, 4, 4);
    }

    // Draw a white border showing the collider rect used for collision detection
    // Used for debugging — toggle with 'u' key
    drawCollider(ctx) {
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.rect(this.collider.x,
                 this.collider.y,
                 this.collider.width,
                 this.collider.height);
        ctx.stroke();
    }

    // Empty update method — meant to be overridden by subclasses
    update() {

    }
}
export { GameObject }