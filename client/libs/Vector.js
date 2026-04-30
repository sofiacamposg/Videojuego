//& Vector.js
//& 2D vector math class used throughout the game for positions, sizes, and movement
//& Every game object uses Vector for its position and halfSize properties

//* represents a 2D point or direction with x and y components
//* provides basic math operations needed for movement and collision calculations
class Vector {
    constructor(x, y) {
        this.x = x;  // horizontal component
        this.y = y;  // vertical component
    }

    //* returns a new vector that is the sum of this and another vector
    plus(other) {
        return new Vector(this.x + other.x, this.y + other.y);
    }

    //* returns a new vector that is the difference of this and another vector
    minus(other) {
        return new Vector(this.x - other.x, this.y - other.y);
    }

    //* returns a new vector scaled by a scalar value
    times(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }

    //* returns the length of the vector (distance from origin)
    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    //* returns the squared length — faster than magnitude() when only comparing distances
    squareLength() {
        return this.x ** 2 + this.y ** 2;
    }

    //* returns a unit vector pointing in the same direction
    //* returns (0,0) if the vector has no length to avoid division by zero
    normalize() {
        const mag = this.magnitude();
        if (mag == 0) {
            return new Vector(0, 0);  // avoid division by zero
        }
        return new Vector(this.x / mag, this.y / mag);
    }
}

export { Vector };