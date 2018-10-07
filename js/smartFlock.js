/* SmartFlock:true Flock:true canvas:true */

class SmartFlock extends Flock {
  constructor (flockSize, BoidType) {
    super(flockSize, BoidType)
    this.neighborDistance = 10
    this.neighborDistanceSquared = Math.pow(this.neighborDistance, 2)
  }
  updateFlock () {
    const neighbors = []
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (j !== i) {
          let squareDistance = Math.pow(this.boids[j].position.x - this.boids[i].position.x, 2)
          if (squareDistance < this.neighborDistanceSquared) {
            neighbors.push(this.boids[j])
          }
        } // closes outer if
      } // closes j loop
      this.boids[i].update(neighbors)
    } // closes i loop
  } // closes update flock
} // closes class
