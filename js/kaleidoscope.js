/* Kaleidoscope: true Boid:true */

// keeps boids within bounds of canvas, will 'bounce' off sides
class Kaleidoscope extends Boid {
  constructor (xPos, yPos, planeWidth, planeHeight, wrap) {
    super(xPos, yPos, planeWidth, planeHeight)
    this.wrap = wrap
  }
  updatePosition () {
    super.updatePosition()
    this.wrapLogic()
  }
  wrapLogic () {
    // if wrap is true ...
    if (this.wrap) {
      // need to study further how this works
      this.position.x = (this.position.x + this.velocity.x) % this.planeWidth
      this.position.y = (this.position.y + this.velocity.y) % this.planeHeight
      if (this.position.x < 0) {
        this.position.x = this.planeWidth
      }
      if (this.position.y < 0) {
        this.position.y = this.planeHeight
      }
      // else continue as Boid Class
    } else {
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
    }
    this.acceleration = { x: 0, y: 0 }
  }
}
