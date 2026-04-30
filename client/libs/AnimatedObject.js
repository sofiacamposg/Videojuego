import { GameObject } from "./GameObject.js";

class AnimatedObject extends GameObject {

  constructor(position, width, height, color, type, sheetCols) {
    super(position, width, height, color, type);

    this.frame = 0; // Current active frame
    this.minFrame = 0; // First frame of the animation range
    this.maxFrame = 0; // Last frame of the animation range

    this.sheetCols = sheetCols; // Number of columns in the spritesheet

    this.repeat = true; // Should the animation loop?

    this.frameDuration = 100; // How long each frame lasts in ms
    this.totalTime = 0; // Accumulates deltaTime to know when to advance to the next frame
  }

  setAnimation(minFrame, maxFrame, repeat, duration) { // Define which frames to use and how
    this.minFrame = minFrame;
    this.maxFrame = maxFrame;
    this.frame = minFrame; // Start at the first frame
    this.repeat = repeat;
    this.totalTime = 0;
    this.frameDuration = duration;
  }

  // Automatically advances the animation frame based on elapsed time
  updateAnimation(deltaTime){
    this.totalTime += deltaTime;
    if (this.totalTime > this.frameDuration){
      this.frame ++; // Enough time has passed, move to the next frame
      if (this.frame > this.maxFrame){ // If we reached the last frame
        if (this.repeat){ // If the animation should loop
          this.frame = this.minFrame; // Reset back to the first frame
        }
        else{
          this.frame = this.maxFrame; // Stay on the last frame, no loop
        }
      }
      this.totalTime = 0; // Reset the timer after advancing the frame
    }
    // Update the spritesheet rect to point to the correct frame position
    this.spriteRect.x = (this.frame % this.sheetCols) * this.spriteRect.width;
    this.spriteRect.y = Math.floor(this.frame / this.sheetCols) * this.spriteRect.height;
  }
} // End of AnimatedObject class
export { AnimatedObject };