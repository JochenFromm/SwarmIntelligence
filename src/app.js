
import { Flock } from './flock.js';

document.onkeypress = function (e) {
    e = e || window.event;
    if (e.keyCode == 32) {
      window.flock.SIMULATION_BREAK = !window.flock.SIMULATION_BREAK;
    }
};

var initCanvas = (agents, obstacles, halftime, teaching_time) => {
  window.flock = new Flock("canvas", agents, obstacles, halftime, teaching_time);
  setInterval(window.flock.tick.bind(window.flock), 50);
}

var setAgents = (value) => {
  console.log("setAgents", value);
  window.flock.createNewAgents(value);
}

var setObstacles = (value) => {
  console.log("setObstacles", value);
  window.flock.createNewObstacles(value);
}

var setHalftime = (value) => {
  console.log("setHalftime", value);
  window.flock.reset();
  window.flock.setHalftime(value);
}

var setTeachingTime = (value) => {
  console.log("setTeachingTime", value);
  window.flock.reset();
  window.flock.setTeachingTime(value);
}

export { initCanvas, setAgents, setObstacles, setHalftime, setTeachingTime };
