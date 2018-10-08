// from source code : https://www.blog.drewcutchins.com/blog/2018-8-16-flocking

const vectorUtils = {
  normalize (vec2) {
    const magnitude = Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y)
    if (magnitude === 0) {
      return {x: 0, y: 0}
    }
    return {x: vec2.x / magnitude, y: vec2.y / magnitude}
  },
  distance (thisBoid, neighbor) {
    // console.log(thisBoid, neighbor);
    const x = Math.pow((thisBoid.x - neighbor.position.x), 2)
    const y = Math.pow((thisBoid.y - neighbor.position.y), 2)
    return Math.pow((x + y), .5)
  }
}
