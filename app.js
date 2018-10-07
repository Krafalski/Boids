/* global document:true */
const canvas = document.createElement('canvas')
canvas.width = 300
canvas.height = 300

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.container')

  const ctx = canvas.getContext('2d')

  container.appendChild(canvas)
  const flock = new Flock(20)
  const loop = () => {
    setTimeout(loop, 20)
    flock.updateFlock()
    ctx.save()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawingUtils.renderFlock(flock, ctx)
    ctx.restore()
  }
  loop()
})

class Boid {
  constructor (xPos, yPos, planeWidth, planeHeight, wrap) {
    this.mass = 1
    this.planeWidth = planeWidth
    this.planeHeight = planeHeight
    this.wrap = wrap
    this.position = { x: xPos, y: yPos }
    this.velocity = { x: 0, y: 0 }
    this.acceleration = { x: 0, y: 0 }
  }
  get heading () {
    return Math.atan2(this.velocity.y, this.velocity.x)
  }
  applyForce (force) {
    this.acceleration.x += force.x / this.mass
    this.acceleration.y += force.y / this.mass
  }
  update () {
    this.updatePosition()
  }
  updatePosition () {
    this.velocity.x += this.acceleration.x
    this.velocity.y += this.acceleration.y

    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.wrap) {
      this.position.x = (this.position.x + this.velocity.x) % this.planeWidth
      this.position.y = (this.position.y + this.velocity.y) % this.planeHeight
      if (this.position.x < 0) {
        this.position.x = this.planeWidth
      }
      if (this.position.y < 0) {
        this.position.y = this.planeHeight
      }
    } else {
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
    }

    this.acceleration = { x: 0, y: 0 }
  }
}

class Flock {
  constructor (flockSize) {
    this.boids = []
    this.size = flockSize
    this.populateFlock()
  }

  populateFlock () {
    for (let n = 0; n < this.size; n++) {
      this.boids.push(new Boid(canvas.width / 2, canvas.height / 2, canvas.width, canvas.height, true))
      let angle = (n / this.size) * 2 * Math.PI
      this.boids[n].velocity = {x: Math.cos(angle), y: Math.sin(angle)}
    }
  }
  updateFlock () {
    for (let boid of this.boids) {
      boid.update()
    }
  }
}

const drawingUtils = {
  drawTriangle (context, PosX, PosY, SideLength, Orientation) {
    context.setTransform(1, 0, 0, 1, PosX, PosY) // Set position
    context.rotate(Orientation) // set rotation in radians
    context.beginPath()
    const sides = 3
    const a = ((Math.PI * 2) / sides)
    context.moveTo(SideLength, 0)
    context.lineTo(SideLength * Math.cos(a * 1), SideLength * Math.sin(a * 1))
    context.lineTo((SideLength + 3) * Math.cos(a * 3), (SideLength + 3) * Math.sin(a * 3))
    context.lineTo(SideLength * Math.cos(a * 2), SideLength * Math.sin(a * 2))
    context.closePath()
    context.fill()
    context.setTransform(1, 0, 0, 1, 0, 0) // reset the transform
    return true
  },
  renderBoid (boid, context) {
    this.drawTriangle(context, boid.position.x, boid.position.y, 15, boid.heading)
  },
  renderFlock (flock, context) {
    for (let boid of flock.boids) {
      this.renderBoid(boid, context)
    }
  }
}
