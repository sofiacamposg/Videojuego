class Player extends AnimatedObject {

  constructor(position){
    super(position,80,80,"white","player",6)

    this.health = 100
    this.speed = 4
  }

  update(){
    // movimiento
  }

  draw(ctx){
    super.draw(ctx)
  }

}