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

class SeparatorBoid extends Kaleidoscope {
  constructor (xPos, yPos, planeWidth, planeHeight, wrap, separationDistance = 5, separationStrength = 1) {
    super(xPos, yPos, planeWidth, planeHeight, wrap)
    this.separationDistance = separationDistance
    this.separationStrength = separationStrength
  }
  update (neighbors) {
    const separationForce = this.calculateSeparation(neighbors)
    this.applyForce(separationForce)
    this.updatePosition()
  }
  calculateSeparation (neighbors) {
    const separationForce = { x: 0, y: 0 }
    for (let neighbor of neighbors) {
      let distance = Math.sqrt(this.position.x - neighbor.position.x, this.position.y - neighbor.position.y)
      if (distance > this.separationDistance) {
        let offset = {
          x: this.position.x - neighbor.position.x,
          y: this.position.y - neighbor.position.y
        }
        let normalizedOffset = vectorUtils.normalize(offset)
        let force = { x: normalizedOffset.x /= distance, y: normalizedOffset.y /= distance }
        separationForce.x += force.x
        separationForce.y += force.y
      }
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
