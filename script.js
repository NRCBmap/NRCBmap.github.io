var xScreenSize = innerWidth - 5; // canvas size
var yScreenSize = innerHeight - 5;
var mapImg;

function renderContinentNames() {
  for (var i = 0; i < continents.length; i++) {
    continents[i].render();
  }
}

function renderProvinces(Provinces) {
  for (var i = 0; i < Provinces.length; i++) {
    Provinces[i].render();
  }
}


function preload() {
  mapImg = loadImage('Map.png');
}

function setup() { // p5 setup
  createCanvas(xScreenSize, yScreenSize);
  background(255);
  noSmooth();
  noLoop();
  redraw();
  textAlign(CENTER,CENTER);
}

var camX = 250;
var camY = 300;
var zoom = 0.2;

var dragStartX;
var dragStartY;
var dragStartCamX;
var dragStartCamY;

var onMapMousePos = [0,0];

function mousePressed() {
  dragStartX = mouseX;
  dragStartY = mouseY;
  dragStartCamX = camX;
  dragStartCamY = camY;
  redraw();
}

function mouseDragged() {
  camX = dragStartCamX - (dragStartX-mouseX)
  camY = dragStartCamY - (dragStartY-mouseY)
  redraw();
}

function mouseMoved() {
  redraw();
}

function mouseWheel(event) {
  // print(event.delta);
  if (event.delta > 0) {
    if (zoom > 0.1) {
      var factor = 1-(1/10)
      zoom = zoom * factor
      camX = (camX-mouseX) * factor + mouseX
      camY = (camY-mouseY) * factor + mouseY
    }
  } else {
    if (zoom < 50) {
      var factor = 1+(1/10)
      zoom = zoom * factor
      camX = (camX-mouseX) * factor + mouseX
      camY = (camY-mouseY) * factor + mouseY
    }
  }
  redraw();

  // console.log(zoom);
  return false;
}

function getOnMapPos(x,y) {
  return ([(-camX+x)/zoom, (-camY+y)/zoom]);
}

function draw() {
  onMapMousePos = getOnMapPos(mouseX, mouseY);
  background(68,107,164);
  translate(camX, camY);
  scale(zoom);
  image(mapImg,0,0);
  renderContinentNames();
  // fill(0);
  // noStroke();
  // ellipse(onMapMousePos[0], onMapMousePos[1], 20/zoom, 20/zoom);
}
