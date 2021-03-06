
import { Point } from './point.js';
import { Vector } from './vector.js';

class Agent {
  constructor(x, y, dx, dy) {
    this.pos = new Point(x,y);
    this.speed = new Vector(dx,dy);
    this.steering = new Vector(0,0);
    this.timestep = 0;

    this.HALFTIME = 140;
    this.TEACHING_TIME = 70;
    this.FEARFULNESS = 100;

    this.SIZE = 2;
    this.PERSONAL_SPACE = 20;
    this.highlight = false;
  }

  resetSteering() {
    this.steering = new Vector(0,0);
  }

  getSteering(desired_direction, MAX_SPEED, MAX_FORCE) {
    let d = desired_direction.length();
    desired_direction.normalize(MAX_SPEED);
    if (d < 100.0) {
      desired_direction.multiply(MAX_SPEED*(d/100.0))
    } else {
      desired_direction.multiply(MAX_SPEED)
    }

    let result = desired_direction.subtract(this.speed);
    result.normalize(MAX_FORCE);
    return result;
  }

  willStrength() {
    return this.fearFactor() * this.oblivionFactor();
  }

  /*
   * fearfulness factor that ranges
   * from 1 (100% fear) to 0 (no fear)
   */
  fearFactor() {
     return this.FEARFULNESS / 100;
  }

  /*
   * forgetfulness factor that ranges
   * from 1 (full memory) to 0 (total memory loss)
   */
  oblivionFactor() {
    return Math.pow(2, - this.timestep / this.HALFTIME);
  }

  /*
   * Calculate steering vector according to Craig Reynolds
   * steering = desired_velocity - velocity
   */
  steer(desired_direction, MAX_FORCE) {
    let result = desired_direction.subtract(this.speed);
    result.normalize(MAX_FORCE);
    this.steering = this.steering.add(result);
  }

  applySteering() {
    this.speed = this.speed.add(this.steering);
  }

  get_velocity() {
    return this.speed.length();
  }

  get_direction() {
    return this.speed.angle();
  }

  set_direction(angle) {
    const len = this.get_velocity();

    this.speed.x = Math.cos(angle) * len;
    this.speed.y = Math.sin(angle) * len;
  }

  collision(position) {
    return (this.pos.distance(position) < this.PERSONAL_SPACE);
  }

  change_direction(angle) {
    this.speed.x = Math.cos(angle) * this.speed.x - Math.sin(angle) * this.speed.y;
    this.speed.y = Math.sin(angle) * this.speed.x + Math.cos(angle) * this.speed.y;
  }

  change_speed(delta) {
    let angle = this.speed.angle();
    let velocity = this.speed.length()

    this.speed.x = Math.cos(angle) * (velocity + delta);
    this.speed.y = Math.sin(angle) * (velocity + delta);
  }

  wrap(canvas, pos) {
    if (pos.x > canvas.width) { pos.x = 0 }
    if (pos.y > canvas.height) { pos.y = 0 }
    if (pos.x < 0) { pos.x = canvas.width }
    if (pos.y < 0) { pos.y = canvas.height }
    return pos;
  }

  predict_position(canvas, speed, MAX_FORCE) {
    speed.normalize(MAX_FORCE);
    let pos = new Point(this.pos.x, this.pos.y);

    pos.x += speed.x;
    pos.y += speed.y;
    this.wrap(canvas, pos);
    return pos;
  }

  move(canvas) {
    this.pos.x += this.speed.x;
    this.pos.y += this.speed.y;
    this.wrap(canvas, this.pos);
    this.timestep += 1;

    if (this.timestep > this.TEACHING_TIME) {
      this.timestep = 0;
    }
  }

  draw(context, highlight = false) {
    context.beginPath();
    context.arc(this.pos.x, this.pos.y, this.SIZE, 0, Math.PI*2);
    context.fillStyle = "#0095DD";
    if (this.highlight || highlight) context.fillStyle = "#DD9500";
    context.fill();
    context.closePath();
  }
}

export { Agent };
