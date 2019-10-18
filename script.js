var xScreenSize = innerWidth - 5; // canvas size
var yScreenSize = innerHeight - 5;
var mapImg;

function setup() { // p5 setup
  createCanvas(xScreenSize, yScreenSize);
  background(255);
  noSmooth();
  mapImg = loadImage('mappng.png');
}

var camX = 0;
var camY = 0;
var zoom = 1;

var dragStartX;
var dragStartY;
var dragStartCamX;
var dragStartCamY;

function mousePressed() {
  dragStartX = mouseX;
  dragStartY = mouseY;
  dragStartCamX = camX;
  dragStartCamY = camY;
}

function mouseDragged() {
  camX = dragStartCamX - (dragStartX-mouseX)
  camY = dragStartCamY - (dragStartY-mouseY)
}

function mouseWheel(event) {
  // print(event.delta);
  if (event.delta > 0) {
    if (zoom > 0.1) {
      zoom = zoom * (9/10)
      camX = (camX-mouseX) * (9/10) + mouseX
      camY = (camY-mouseY) * (9/10) + mouseY
    }
  } else {
    if (zoom < 50) {
      zoom = zoom * (10/9)
      camX = (camX-mouseX) * (10/9) + mouseX
      camY = (camY-mouseY) * (10/9) + mouseY
    }
  }

  return false;
}

function draw() {
  background(68,107,164);
  translate(camX, camY);
  scale(zoom);
  image(mapImg,0,0);
  fill(0);
  noStroke();
  ellipse((-camX+mouseX)/zoom, (-camY+mouseY)/zoom, 20/zoom, 20/zoom)
}
