
import { Point } from './point.js';

class Vector extends Point {
  angle() {
    return Math.atan2(this.y, this.x);
  }

  add(vector) {
    let result = new Vector();
    result.x = this.x + vector.x;
    result.y = this.y + vector.y;
    return result;
  }

  subtract(vector) {
    let result = new Vector();
    result.x = this.x - vector.x;
    result.y = this.y - vector.y;
    return result;
  }

  multiply(factor) {
    this.x *= factor;
    this.y *= factor;
  }

  angleTo(vector) {
    return Math.atan2(vector.y - this.y, vector.x - this.x);
  }

  length() {
    return Math.sqrt(this.x*this.x+this.y*this.y);
  }

  normalize(desiredLength) {
    let angle = this.angle();
    this.x = desiredLength * Math.cos(angle);
    this.y = desiredLength * Math.sin(angle);
  }

  flip() {
    this.x = -this.x;
    this.y = -this.y;
  }
}

export { Vector };
