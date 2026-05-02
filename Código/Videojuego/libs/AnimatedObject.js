/* 
& Processes static spritesheets into time-driven animations, handles:
& animation configuration and frame progression
& Made by Gilberto Echeverría 

^ Note: We recommend installing the Colorful Comments extension to improve code readability 
^ https://marketplace.visualstudio.com/items?itemName=ParthR2031.colorful-comments
^ Color Legend:
    & pink: file description
    * green: section title
    ~ purple: general funtion description
*/

//* === imports ===
import { GameObject } from "./GameObject.js";

//* === class animated === 
class AnimatedObject extends GameObject {

  constructor(position, width, height, color, type, sheetCols) {
    super(position, width, height, color, type);

    this.frame = 0; // current frame
    this.minFrame = 0;
    this.maxFrame = 0;

    this.sheetCols = sheetCols; // frames number

    this.repeat = true; // does animation repeats?

    this.frameDuration = 100;
    this.totalTime = 0; //when to change frame?
  }

  setAnimation(minFrame, maxFrame, repeat, duration) { //~ which frame 
    this.minFrame = minFrame;
    this.maxFrame = maxFrame;
    this.frame = minFrame;
    this.repeat = repeat;
    this.totalTime = 0;
    this.frameDuration = duration;
  }


  updateAnimation(deltaTime){  //~ update animation automatically
    this.totalTime += deltaTime;
    if (this.totalTime > this.frameDuration){
      this.frame ++; //when to move to next frame
    if (this.frame > this.maxFrame){ //if we are in the last frame
      if (this.repeat){ //case1: repeat
        this.frame = this.minFrame; //minFrame = maxFrame
      }
      else{
        this.frame = this.maxFrame //case2: no repeat, stays in the same frame
      }
    }
    this.totalTime = 0;
  }
  //updates rect
  this.spriteRect.x = (this.frame % this.sheetCols) * this.spriteRect.width;
  this.spriteRect.y = Math.floor(this.frame / this.sheetCols) * this.spriteRect.height;
  }
}

//* === exports ===
export { AnimatedObject };