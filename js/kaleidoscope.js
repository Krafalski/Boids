/* Kaleidoscope: true Boid:true */

// keeps boids within bounds of canvas, will 'bounce' off sides
class Kaleidoscope extends Boid {
  constructor (xPos, yPos, planeWidth, planeHeight, wrap) {
    super(xPos, yPos, planeWidth, planeHeight)
    this.wrap = wrap
    this.mass = 1
    this.maxSpeed = 0.5
  }
  updatePosition () {
    super.updatePosition()

    this.velocity.x = Math.abs(this.velocity.x) > this.maxSpeed ? Math.sign(this.velocity.x) * this.maxSpeed : this.velocity.x
    this.velocity.y = Math.abs(this.velocity.y) > this.maxSpeed ? Math.sign(this.velocity.y) * this.maxSpeed : this.velocity.y

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

class SeparatorBoid extends Kaleidoscope {
  constructor (xPos, yPos, planeWidth, planeHeight, wrap, separationDistance = 5, separationStrength = 1) {
    super(xPos, yPos, planeWidth, planeHeight, wrap)
    this.separationDistance = separationDistance
    this.separationStrength = separationStrength
    console.log(this.separationDistance, this.separationStrength);
  }
  update (neighbors) {
    const separationForce = this.calculateSeparation(neighbors)
    this.applyForce(separationForce)
    this.updatePosition()
  }
  applyForce (force) {
    // increase acceleration by the force
    // currently mass is 1 and has no impact
    this.acceleration.x += force.x / this.mass
    this.acceleration.y += force.y / this.mass
  }
  calculateSeparation (neighbors) {
    const separationForce = { x: 0, y: 0 }
    let count = 0
    for (let neighbor of neighbors) {
      const distance = vectorUtils.distance(this.position, neighbor)
      // are the birds closer than the distance they should be?
      if (distance < this.separationDistance) {
        // how far away are the boid neighbors from each other?
        let offset = {
          x: this.position.x - neighbor.position.x,
          y: this.position.y - neighbor.position.y
        }
        // adjust the offset to something 'normalized'
        let normalizedOffset = vectorUtils.normalize(offset)
        // the greater the distance the less the force
        // the smaller the distance, the greater the force
        let force = { x: normalizedOffset.x / (distance + 0.01), y: normalizedOffset.y / (distance + 0.01) }
        separationForce.x += force.x
        separationForce.y += force.y
        // increase count the number of times the if statement is entered, based on the distance
        count += 1
      }
    }
    // if we went into the previous if statement
    if (count > 0) {
      // divide the force by the count - just one no change
      // more than one then decrease
      // divide by zero is bad
      separationForce.x /= count
      separationForce.y /= count

      // increase the force by the strength of the separation
      separationForce.x *= this.separationStrength
      separationForce.y *= this.separationStrength
    }
    return separationForce
  }
}

// SeparatorBoid
// CohesiveBoid
// SCBoid
// HeaderBoid
// SCHBoid
// mixins inheritance aggregator
// https://stackoverflow.com/questions/29879267/es6-class-multiple-inheritance

// class Person{
//    constructor(n){
//       this.name=n;
//    }
// }
// class Male{
//    constructor(s='male'){
//       this.sex=s;
//    }
// }
// class Child{
//    constructor(a=12){
//       this.age=a;
//    }
//    tellAge(){console.log(this.name+' is '+this.age+' years old.');}
// }
// class Boy extends aggregation(Person,Male,Child){}
// var m = new Boy('Mike');
// m.tellAge(); // Mike is 12 years old.
