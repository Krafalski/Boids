// from source code : https://www.blog.drewcutchins.com/blog/2018-8-16-flocking

const vectorUtils = {
  normalize (vec2) {
    var magnitude = Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y)
    if (magnitude === 0) {
      return {x: 0, y: 0}
    }
    return {x: vec2.x / magnitude, y: vec2.y / magnitude}
  }
}
