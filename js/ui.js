/* global document:true event:true  Flock:true flock:true boidType:true Boid: true ctx:true canvas:true Kaleidoscope:true drawingUtils:true  SmartFlock:true */

// document on ready
document.addEventListener('DOMContentLoaded', () => {
  // control values
  let boidType = Boid
  let FlockType = Flock
  let animation = 'Moving Boids'
  let speed = 100
  let boidNum = 20
  let boidSize = 5

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
        FlockType = Flock
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        flock = new FlockType(boidNum, boidType)
      } else if (type.innerText === 'Separator Boid') {
        boidType =  SeparatorBoid
        FlockType = SmartFlock
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        flock = new FlockType(boidNum, boidType)
        const strength = document.createElement('input')
        strength.setAttribute('type', 'range')
        strength.setAttribute('name', 'strength')
        strength.setAttribute('min', 1)
        strength.setAttribute('max', 20)
        strength.setAttribute('step', 1)
        strength.setAttribute('id', 'strength')
        document.querySelector('body').appendChild(strength)
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
    flock = new Flock(boidNum, boidType)
  })
  const selectBoidSize = document.querySelector('#boid-size')
  selectBoidSize.addEventListener('change', () => {
    boidSize = selectBoidSize.value
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    flock = new Flock(boidNum, boidType)
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
        flock = new Flock(boidNum, boidType)
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
      this.drawTriangle(context, boid.position.x, boid.position.y, parseInt(boidSize), boid.heading)
    },
    // draw/render each boid
    renderFlock (flock, context) {
      for (let boid of flock.boids) {
        this.renderBoid(boid, context)
      }
    }
  }
  // on page load start animation
  loop()
}) // closes document on ready
