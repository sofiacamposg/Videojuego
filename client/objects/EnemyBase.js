class Enemy extends AnimatedObject {

  constructor(position){
    super(position,80,80,"white","enemy",4)

    this.health = 30
    this.damage = 10
  }

  update(){
    // lógica de movimiento
  }

}