/* global document:true event:true */

// Set up canvas - global access
const canvas = document.createElement('canvas')
canvas.width = 300 // default
canvas.height = 300 // default

// document on ready
document.addEventListener('DOMContentLoaded', () => {
  // control values
  let boidType = 'Boid'
  let animation = 'Moving Boids'
  let speed = 10
  let boidNum = 20
  let flock = new Flock(boidNum, Boid)
  let animate
  // event listeners/handlers
  // boild type selection
  const selectBoildType = document.querySelectorAll('.boid-type')
  selectBoildType.forEach(type => {
    type.addEventListener('click', () => {
      // remove selected class
      selectBoildType.forEach(type => {
        type.classList.remove('selected')
      })
      // add selected class to selected type
      event.currentTarget.classList.add('selected')
      boidType = type.innerText
      if (type.innerText === 'Basic Boid') {
        boidType = Boid
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        flock = new Flock(boidNum, boidType)
      } else {
        boidType = Kaleidoscope
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        flock = new Flock(boidNum, boidType)
      }
    })
  })
  // animation type selection
  const selectAnimation = document.querySelectorAll('.animation')
  selectAnimation.forEach(type => {
    type.addEventListener('click', () => {
      // remove selected class
      selectAnimation.forEach(type => {
        type.classList.remove('selected')
      })
      // add selected class to selected type
      event.currentTarget.classList.add('selected')
      animation = type.innerText
    })
  })
  // speed selection
  const boidSpeed = document.querySelector('#speed')
  boidSpeed.addEventListener('change', () => {
    // make range slider intuitve and speeds reasonable
    speed = (5 / boidSpeed.value) * 100
  })
  // number of boids
  const numberOfBoids = document.querySelector('#num-of-boids')
  numberOfBoids.addEventListener('change', () => {
    boidNum = numberOfBoids.value
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    flock = new Flock(boidNum, Boid)
  })
  // start
  // stop
  // reset
  const controllButtons = document.querySelectorAll('button')
  controllButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (button.innerText === 'Start') {
        loop()
      } else if (button.innerText === 'Stop') {
        clearTimeout(animate)
      } else {
        clearTimeout(animate)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        flock = new Flock(boidNum, Boid)
        loop()
      }
    })
  })

  // put canvas in div container
  const container = document.querySelector('.canvas-container')
  container.appendChild(canvas)
  // set canvas 2d context
  const ctx = canvas.getContext('2d')

  // Create a new flock
  // how many boids?, what kind of boids?
  flock = new Flock(boidNum, Boid)
  // animate boids
  const loop = () => {
    // call loop ever 100 milliseconds
    animate = setTimeout(loop, speed)
    // move the flock, according to rules
    flock.updateFlock()
    // save default state - not sure what this does
    ctx.save()
    if (animation === 'Moving Boids') {
      // removes the now previous bird
      // looks even more like a Kaleidoscope w/out clear
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    drawingUtils.renderFlock(flock, ctx)
    // restores ... need to look this up
    ctx.restore()
  }
  // on page load start animation
  loop()
}) // closes document on ready

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

const drawingUtils = {
  // make boids awesome triangle shape
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
    // alternate boid color  - because why not?
    if (context.fillStyle === '#b6b6b6') {
      context.fillStyle = '#909090'
    } else {
      context.fillStyle = '#b6b6b6'
    }
    context.fill()
    context.setTransform(1, 0, 0, 1, 0, 0) // reset the transform
    return true
  },
  // draw/render one bird
  renderBoid (boid, context) {
    this.drawTriangle(context, boid.position.x, boid.position.y, 15, boid.heading)
  },
  // draw/render each boid
  renderFlock (flock, context) {
    for (let boid of flock.boids) {
      this.renderBoid(boid, context)
    }
  }
}
