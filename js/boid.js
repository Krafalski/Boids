/* Boid:true vectorUtils:true */

// basic boid class
// boids will be positioned and move outwards
class Boid {
  constructor (xPos, yPos, planeWidth, planeHeight, wrap) {
    // set boundries based on canvas size
    this.planeWidth = planeWidth
    this.planeHeight = planeHeight
    this.position = { x: xPos, y: yPos }
    this.velocity = { x: 0, y: 0 }
    this.acceleration = { x: 0, y: 0 }
  }
  // aligns bird 'head' with velocity
  get heading () {
    return Math.atan2(this.velocity.y, this.velocity.x)
  }
  // more functionality to come
  update () {
    this.updatePosition()
  }
  // steps birds forward one position based on velcity and acceleration
  updatePosition () {
    this.velocity.x += this.acceleration.x
    this.velocity.y += this.acceleration.y

    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    // reset accelration for each frame
    this.acceleration = {x: 0, y: 0}
  }
}
