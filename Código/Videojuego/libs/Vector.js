/* 
& Player and enemy movement math logic for the canvas.
& Made by Gilberto Echeverría 

^ Note: We recommend installing the Colorful Comments extension to improve code readability 
^ https://marketplace.visualstudio.com/items?itemName=ParthR2031.colorful-comments
^ Color Legend:
    & pink: file description
    * green: section title
    ~ purple: general funtion description
*/

//* === calss Vector ===
//~ used in 2D GAMES, handle movement and physics
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    plus(other) {
        return new Vector(this.x + other.x, this.y + other.y);
    }

    minus(other) {
        return new Vector(this.x - other.x, this.y - other.y);
    }

    times(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }

    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    squareLength() {
        return this.x ** 2 + this.y ** 2;
    }

    normalize() {
        const mag = this.magnitude();
        if (mag == 0) {
            return new Vector(0, 0);
        }
        return new Vector(this.x / mag, this.y / mag);
    }
}

//* === export ===
export { Vector };