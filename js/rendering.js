/* drawingUtils:true */

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
