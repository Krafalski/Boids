/* Boid:true vectorUtils:true */

// basic boid class
// boids will be positioned and move outwards
class Boid {
  constructor (xPos, yPos, planeWidth, planeHeight, wrap) {
    // need to look up what this does
    this.mass = 1
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
  // not currently using this?
  applyForce (force) {
    this.acceleration.x += force.x / this.mass
    this.acceleration.y += force.y / this.mass
  }
  // more functionality to come?
  update () {
    this.updatePosition()
  }
  // steps birds forward one position based on velcity and acceleration
  updatePosition () {
    this.velocity.x += this.acceleration.x
    this.velocity.y += this.acceleration.y

    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}
