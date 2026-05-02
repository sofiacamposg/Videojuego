/* 
& Defines the spriteRect for characters. Imported by AnimatedObject and GameObject
& Made by Gilberto Echeverría 

^ Note: We recommend installing the Colorful Comments extension to improve code readability 
^ https://marketplace.visualstudio.com/items?itemName=ParthR2031.colorful-comments
^ Color Legend:
    & pink: file description
    * green: section title
    ~ purple: general funtion description
*/

"use strict";
//* === class Rect ===
//~ have 4 atributes every rectangle has 
class Rect {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}
//* === export ===
export { Rect };