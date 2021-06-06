
const field_offset = -0.2 // 1.5 //
const field_size = 1.0 // 3.5 //
const margin = 0.1 // 1.0 //

const params = [
  [360, -86, -4, -310, 28, 192, 51, 158, -230, -126],
  [360, -82, -2, -310, 13, 192, 51, 158, -283, -126],
  [345, -82, -2, -359, 13, 171, 68, 150, -283, -124],
  [345, -82, 28, -359, 13, 112, 12, 174, -283, -124],
  [92, 108, 22, -135, 22, 379, -18, 2, -383, 0],
  [128, 104, 19, -155, 24, 433, 17, -36, -383, 0],
  [282, 114, 29, -444, -45, 406, 126, -89, -486, 5],
  [282, 114, 29, -444, -45, 449, 126, -106, -486, 5],
  [35, 87, 61, -32, -47, 414, 120, -89, -411, 26],
  [60, 87, 43, -32, -47, 414, 112, -89, -415, 26],
  [35, 79, 105, -2, -47, 38, 86, -89, 36, 26],
  [105, 79, 105, 22, -47, 40, -67, -89, 32, 30],
]

function downloadImg(){
  document.getElementById("downloader").download = "ifs.png";
  document.getElementById("downloader").href = document.getElementById("canvas").toDataURL("image/png").replace(/^data:image\/[^;]/, 'data:application/octet-stream');
}

function loadParams(element){
  a = params[element.value-1]

  setParam1(a[0], false)
  setParam2(a[1], false)
  setParam3(a[2], false)
  setParam4(a[3], false)
  setParam5(a[4], false)
  setParam6(a[5], false)
  setParam7(a[6], false)
  setParam8(a[7], false)
  setParam9(a[8], false)
  setParam10(a[9])

  document.getElementById("Slider1").value = window.a1
  document.getElementById("Slider2").value = window.a2
  document.getElementById("Slider3").value = window.a3
  document.getElementById("Slider4").value = window.a4
  document.getElementById("Slider5").value = window.a5
  document.getElementById("Slider6").value = window.a6
  document.getElementById("Slider7").value = window.a7
  document.getElementById("Slider8").value = window.a8
  document.getElementById("Slider9").value = window.a9
  document.getElementById("Slider10").value = window.a10
}

var drawLine = (x1, y1, x2, y2) => {
  x1 = (x1 + field_offset) * (window.size / field_size)
  y1 = (y1 + field_offset) * (window.size / field_size)
  x2 = (x2 + field_offset) * (window.size / field_size)
  y2 = (y2 + field_offset) * (window.size / field_size)
  window.context.globalAlpha = 1.0;
  window.context.beginPath();
  window.context.moveTo(x1, y1);
  window.context.lineTo(x2, y2);
  window.context.strokeStyle = "#CCCCCC";
  window.context.stroke();
  window.context.closePath();
}

var drawPoint = (x, y) => {
  x = (x + field_offset) * (window.size / field_size)
  y = (y + field_offset) * (window.size / field_size)
  window.context.globalAlpha = 0.2;
  window.context.fillStyle = "#FF0000";
  window.context.fillRect(x,y,1,1);
}

var f = (x, y) => {
  x_new = (window.a1/100)*x +
          (window.a2/100)*x*y +
          (window.a3/100)*y +
          (window.a4/100)*x*x +
          (window.a5/100)*y*y;
  y_new = (window.a6/100)*y +
          (window.a7/100)*y*x +
          (window.a8/100)*x +
          (window.a9/100)*y*y +
          (window.a10/100)*x*x;
  return [x_new, y_new];
}

var drawGrid = () => {
  step = 0.02
  // horizontal lines
  for (i = (-field_offset); i <= (field_size-field_offset); i += step) {
    for (j = (-field_offset); j <= (field_size-field_offset); j += step) {
      [x1, y1] = f(j, i);
      [x2, y2] = f(j+step, i);
      drawLine(x1, y1, x2, y2)
    }
  }
  // vertical lines
  for (i = (-field_offset); i <= (field_size-field_offset); i += step) {
    for (j = (-field_offset); j <= (field_size-field_offset); j += step) {
      [x1, y1] = f(i, j);
      [x2, y2] = f(i, j+step);
      drawLine(x1, y1, x2, y2);
    }
  }
}

var drawIFS = () => {
  step = 0.02
  from = -(field_offset+margin)
  to = (field_size-field_offset+margin)
  for (i = from; i <= to; i += step) {
    for (j = from; j <= to; j += step) {
      x = i
      y = j
      for (n = 0; n < 200; n += 1) {
        [x, y] = f(x, y);
        drawPoint(x, y);
      }
    }
  }
}

var draw = () => {
  window.context.clearRect(0, 0, window.canvas.width, window.canvas.height);
  window.context.fillStyle = "#FFFFFF";
  window.context.rect(0, 0, window.canvas.width, window.canvas.height);
  window.context.fill()
  drawGrid()
  drawIFS()
}

var initCanvas = () => {
  window.canvas = document.getElementById("canvas");
  window.context = window.canvas.getContext("2d");
  window.size = window.innerHeight-20;
  window.context.canvas.width = size;
  window.context.canvas.height = size;

  a = params[5]

  setParam1(a[0], false)
  setParam2(a[1], false)
  setParam3(a[2], false)
  setParam4(a[3], false)
  setParam5(a[4], false)
  setParam6(a[5], false)
  setParam7(a[6], false)
  setParam8(a[7], false)
  setParam9(a[8], false)
  setParam10(a[9])

  document.getElementById("Slider1").value = window.a1
  document.getElementById("Slider2").value = window.a2
  document.getElementById("Slider3").value = window.a3
  document.getElementById("Slider4").value = window.a4
  document.getElementById("Slider5").value = window.a5
  document.getElementById("Slider6").value = window.a6
  document.getElementById("Slider7").value = window.a7
  document.getElementById("Slider8").value = window.a8
  document.getElementById("Slider9").value = window.a9
  document.getElementById("Slider10").value = window.a10
  draw()
}

var setParam1 = (value, redraw = true) => {
  window.a1 = value;
  document.getElementById("a1").textContent=value+"/100="+value/100;
  if (redraw) { draw() }
}
var setParam2 = (value, redraw = true) => {
  window.a2 = value;
  document.getElementById("a2").textContent=value+"/100="+value/100;
  if (redraw) { draw() }
}
var setParam3 = (value, redraw = true) => {
  window.a3 = value;
  document.getElementById("a3").textContent=value+"/100="+value/100;
  if (redraw) { draw() }
}
var setParam4 = (value, redraw = true) => {
  window.a4 = value;
  document.getElementById("a4").textContent=value+"/100="+value/100;
  if (redraw) { draw() }
}
var setParam5 = (value, redraw = true) => {
  window.a5 = value;
  document.getElementById("a5").textContent=value+"/100="+value/100;
  if (redraw) { draw() }
}
var setParam6 = (value, redraw = true) => {
  window.a6 = value;
  document.getElementById("a6").textContent=value+"/100="+value/100;
  if (redraw) { draw() }
}
var setParam7 = (value, redraw = true) => {
  window.a7 = value;
  document.getElementById("a7").textContent=value+"/100="+value/100;
  if (redraw) { draw() }
}
var setParam8 = (value, redraw = true) => {
  window.a8 = value;
  document.getElementById("a8").textContent=value+"/100="+value/100;
  if (redraw) { draw() }
}
var setParam9 = (value, redraw = true) => {
  window.a9 = value;
  document.getElementById("a9").textContent=value+"/100="+value/100;
  if (redraw) { draw() }
}
var setParam10 = (value, redraw = true) => {
  window.a10 = value;
  document.getElementById("a10").textContent=value+"/100="+value/100;
  if (redraw) { draw() }
}

window.initCanvas = initCanvas
window.setParam1 = setParam1
window.setParam2 = setParam2
window.setParam3 = setParam3
window.setParam4 = setParam4
window.setParam5 = setParam5
window.setParam6 = setParam6
window.setParam7 = setParam7
window.setParam8 = setParam8
window.setParam9 = setParam9
window.setParam10 = setParam10
window.downloadImg = downloadImg
window.loadParams = loadParams
