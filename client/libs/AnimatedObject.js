import { GameObject } from "./GameObject.js";

class AnimatedObject extends GameObject {

  constructor(position, width, height, color, type, sheetCols) {
    super(position, width, height, color, type);

    this.frame = 0; //Frame actual
    this.minFrame = 0;
    this.maxFrame = 0;

    this.sheetCols = sheetCols; //num de frames

    this.repeat = true; //animación se repite?

    this.frameDuration = 100;
    this.totalTime = 0; //Sirve para saber cuando cambiar de frame
  }

  setAnimation(minFrame, maxFrame, repeat, duration) { //Qué frames usar
    this.minFrame = minFrame;
    this.maxFrame = maxFrame;
    this.frame = minFrame;
    this.repeat = repeat;
    this.totalTime = 0;
    this.frameDuration = duration;
  }

//Voy a agregar esta función para que se actualice el frame automaticamente
  updateAnimation(deltaTime){
    this.totalTime += deltaTime;
    if (this.totalTime > this.frameDuration){
      this.frame ++; //Si nos pasamos de lo que definimos como el tiempo de debe durar cada frame, nos movemos al que sigue
    if (this.frame > this.maxFrame){ //Si estamos en el último frame
      if (this.repeat){ //Si repetir es true 
        this.frame = this.minFrame; //hacemos que maxFrame ahora sea minFrame
      }
      else{
        this.frame = this.maxFrame //Si no no pasa nada, no repetimos el frame
      }
    }
    this.totalTime = 0;
  }
  //Actualiza el rect del spritesheet
  this.spriteRect.x = (this.frame % this.sheetCols) * this.spriteRect.width;
  this.spriteRect.y = Math.floor(this.frame / this.sheetCols) * this.spriteRect.height;
  }
}//Termina la clase
export { AnimatedObject };