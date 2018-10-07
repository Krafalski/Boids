/* Flock:true canvas:true */

// factory for generating boids
class Flock {
  constructor (flockSize, BoidType) {
    this.boids = []
    this.size = flockSize
    this.BoidType = BoidType
    this.populateFlock()
  }
  populateFlock () {
    for (let n = 0; n < this.size; n++) {
      // start boids in the center
      this.boids.push(new this.BoidType(canvas.width / 2, canvas.height / 2, canvas.width, canvas.height, true))
      // spread birds out in a circle around the center for their starting position
      let angle = (n / this.size) * 2 * Math.PI
      // set initial velocity (align with head/initial positioning)
      this.boids[n].velocity = {x: Math.cos(angle), y: Math.sin(angle)}
    }
  }
  // loop over each boid and update
  updateFlock () {
    for (let boid of this.boids) {
      boid.update()
    }
  }
}
