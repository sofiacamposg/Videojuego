//& TextLabel.js
//& Simple class to draw styled text at a fixed position on the canvas
//& Used for displaying labels, counters, and UI text elements in the game

/*
 * Class to draw text at specific positions within the game canvas
 *
 * Gilberto Echeverria
 * 2026-02-10
 */

"use strict";

//* stores position and style for a text label, and draws it on the canvas
class TextLabel {
    constructor(x, y, font, color) {
        this.x = x;      // horizontal position on the canvas
        this.y = y;      // vertical position on the canvas
        this.font = font;   // font string (e.g. "20px VT323")
        this.color = color; // fill color for the text
    }

    //* draws the given text at this label's position using its stored font and color
    draw(ctx, text) {
        ctx.font = this.font;
        ctx.fillStyle = this.color;
        ctx.fillText(text, this.x, this.y);
    }
}