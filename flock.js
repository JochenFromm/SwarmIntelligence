
import { Agent } from './agent.js';
import { Obstacle } from './obstacle.js';
import { Point } from './point.js';
import { Vector } from './vector.js';

const calc_avg = (arr) => arr.reduce((a,b) => a + b, 0) / arr.length;

const MAX_FORCE = 1.0;
const MIN_SPEED = 1.0;
const MAX_SPEED = 3.0;

/*
 * Main class for boids flock
 */
class Flock {
  constructor(canvasId) {
    this.AGENT_NUMBER = 50;
    this.OBSTACLE_NUMBER = 10;
    this.setCanvasSize(canvasId);

    this.agents = [];
    this.obstacles = [];

    for (let i = 0; i < this.OBSTACLE_NUMBER; i += 1) {
      this.obstacles.push(this.createObstacle());
    }

    for (let i = 0; i < this.AGENT_NUMBER; i += 1) {
      this.agents.push(this.createAgent());
    }
  }

  setCanvasSize(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext("2d");
    this.context.canvas.width = window.innerWidth;
    this.context.canvas.height = window.innerHeight;
  }

  createAgent() {
    let point = this.randomPos(100, 100);
    let speed = this.randomSpeed(Math.random(6));
    point = point.add(new Point(100, 100))
    while (this.obstacleCollisions(point).length > 0) { point = this.randomPos(); }
    return new Agent(point.x, point.y, speed.x, speed.y);
  }

  createObstacle() {
    let size = 1;
    if (window.innerWidth > window.innerHeight) {
      size = window.innerWidth/50
    } else {
      size = window.innerHeight/50;
    }
    let point = this.randomPos(this.canvas.width, this.canvas.height);
    let r = (size/2) + Math.random()*(size);
    return new Obstacle(point.x, point.y, r)
  }

  randomPos(width, height) {
    let point = new Point();
    point.x = Math.random() * width;
    point.y = Math.random() * height;
    return point;
  }

  randomSpeed(r) {
    let direction = new Vector(Math.cos(r),Math.sin(r));
    direction.normalize(MAX_SPEED);
    return direction;
  }

  obstacleCollisions(position) {
    let result = [];
    for (let i = 0; i < this.OBSTACLE_NUMBER; i += 1) {
      if (this.obstacles[i].collision(position)) { result.push(i); }
    }
    return result;
  }

  agentCollisions(agent, position) {
    let j = this.agents.indexOf(agent);
    let result = [];
    for (let i = 0; i < this.AGENT_NUMBER; i += 1) {
      if ((i !== j) && (this.agents[i].collision(position))) { result.push(i); }
    }
    return result;
  }

  avoidObstacles(agent) {
    let new_pos = agent.predict_position(this.canvas, agent.speed, MAX_SPEED);
    let collidingObstacles = this.obstacleCollisions(new_pos);

    collidingObstacles.forEach((i) => {
      let pos = this.obstacles[i].pos.subtract(agent.pos);
      let direction = new Vector(-pos.x, -pos.y);
      agent.steer(direction, MAX_FORCE);
    })
  }

  avoidOtherAgents(agent) {
    let collidingAgents = this.agentCollisions(agent, agent.pos);
    collidingAgents.forEach((i) => {
      let pos = this.agents[i].pos.subtract(agent.pos);
      let direction = new Vector(-pos.x, -pos.y);
      agent.steer(direction, MAX_FORCE);
    })
  }

  alignToOtherAgents(agent) {
    // Get flock mates
    let flock_mates = this.agents.filter((mate) => (mate.pos.distance(agent.pos) < 200));

    // Get velocity (=direction) of flock mates
    let flock_direction = new Vector();
    flock_direction.x = calc_avg(flock_mates.map((o) => o.speed.x));
    flock_direction.y = calc_avg(flock_mates.map((o) => o.speed.y));
    flock_direction.normalize(MIN_SPEED);
    agent.steer(flock_direction, MAX_FORCE);
  }

  centerOfFlock(flock_mates) {
    let flock_center = new Point();
    flock_center.x = calc_avg(flock_mates.map((o) => o.pos.x));
    flock_center.y = calc_avg(flock_mates.map((o) => o.pos.y));
    return flock_center;
  }

  highlightFlock(flock_center) {
    this.context.beginPath();
    this.context.arc(flock_center.x, flock_center.y, 200, 0, Math.PI*2);
    this.context.fillStyle = 'rgba(200, 200, 200, 0.2)';
    this.context.fill();
    this.context.closePath();
  }

  stickToFlock(agent) {
    // Get flock mates and their center
    let flock_mates = this.agents.filter((mate) => (mate.pos.distance(agent.pos) < 200));
    let flock_center = this.centerOfFlock(flock_mates);

    // Highlight flock size
    if (this.agents.indexOf(agent) === 1) {
      this.highlightFlock(flock_center);
    }

    // Steer to center unless separation rule violated
    let pos = flock_center.subtract(agent.pos)
    let direction = new Vector(pos.x, pos.y);

    let steering = agent.getSteering(direction, MAX_SPEED, MAX_FORCE)
    let course = agent.predict_position(this.canvas, agent.speed.add(steering), MAX_SPEED);
    if (this.agentCollisions(agent, course).length === 0) {
      agent.steer(direction, MAX_FORCE);
    }
  }

  move(agent) {
    agent.resetSteering()

    // Alignment rule
    this.alignToOtherAgents(agent);

    // Cohesion rule
    this.stickToFlock(agent);

    // Separation rule obstacles
    this.avoidOtherAgents(agent);

    // Separation rule agents
    this.avoidObstacles(agent);

    agent.applySteering();
    agent.speed.normalize(MAX_SPEED);
    agent.move(this.canvas);
  }

  tick() {
    if (!this.context) { return; }
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.OBSTACLE_NUMBER; i += 1) {
      this.obstacles[i].draw(this.context);
    }

    for (let i = 0; i < this.AGENT_NUMBER; i += 1) {
      let agent = this.agents[i];
      agent.draw(this.context, agent.highlight);
      this.move(agent);
    }
  }
}

export { Flock };
