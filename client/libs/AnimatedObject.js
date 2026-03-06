class AnimatedObject extends GameObject {

  constructor(position, width, height, color, type, sheetCols) {
    super(position, width, height, color, type);

    this.frame = 0;
    this.minFrame = 0;
    this.maxFrame = 0;

    this.sheetCols = sheetCols;

    this.repeat = true;

    this.frameDuration = 100;
    this.totalTime = 0;
  }

  setAnimation(minFrame, maxFrame, repeat, duration) {
    this.minFrame = minFrame;
    this.maxFrame = maxFrame;
    this.frame = minFrame;
    this.repeat = repeat;
    this.totalTime = 0;
    this.frameDuration = duration;
  }
}