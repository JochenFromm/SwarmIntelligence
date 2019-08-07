
import { Flock } from '/flock.js';

var initCanvas = () => {
  let page = new Flock("canvas");

  setInterval(page.tick.bind(page), 50);
}

export { initCanvas };
