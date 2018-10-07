/* global document:true event:true  Flock:true flock:true boidType:true Boid: true ctx:true canvas:true Kaleidoscope:true drawingUtils:true  SmartFlock:true */

// document on ready
document.addEventListener('DOMContentLoaded', () => {
  // control values
  let boidType = Boid
  let FlockType = Flock
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
        flock = new FlockType(boidNum, boidType)
      } else {
        boidType = Kaleidoscope
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        flock = new Flock(boidNum, boidType)
      }
    })
  })

  // flock selection
  const selectFlockType = document.querySelectorAll('.flock-type')
  selectFlockType.forEach(type => {
    type.addEventListener('click', () => {
      // remove selected class
      selectFlockType.forEach(type => {
        type.classList.remove('selected')
      })
      // add selected class to selected type
      event.currentTarget.classList.add('selected')
      if (type.innerText === 'Flock') {
        FlockType = Flock
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        flock = new FlockType(boidNum, boidType)
      } else {
        FlockType = SmartFlock
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        flock = new FlockType(boidNum, boidType)
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
  // on page load start animation
  loop()
}) // closes document on ready
