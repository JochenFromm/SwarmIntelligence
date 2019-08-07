
class Point {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  add(vector) {
    let result = new Point();
    result.x = this.x + vector.x;
    result.y = this.y + vector.y;
    return result;
  }

  subtract(vector) {
    let result = new Point();
    result.x = this.x - vector.x;
    result.y = this.y - vector.y;
    return result;
  }

  distance(position) {
    return Math.sqrt((position.x-this.x)*(position.x-this.x) +
                     (position.y-this.y)*(position.y-this.y));

  }
}

export { Point };
