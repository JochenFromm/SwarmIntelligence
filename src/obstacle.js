
import { Point } from './point.js';

class Obstacle {
  constructor(x, y, r) {
    this.pos = new Point(x,y)
    this.r = r;

    // Set color, in hex it would be like "#0095DD"
    this.color = 'rgba(200, 200, 200, 0.5)';
  }

  collision(position) {
    return (this.pos.distance(position) < (this.r*1.4));
  }

  draw(context) {
    context.beginPath();
    context.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI*2);
    context.fillStyle = this.color;
    context.fill();
    context.closePath();
  }
}

export { Obstacle };
