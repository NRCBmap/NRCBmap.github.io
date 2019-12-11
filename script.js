var xScreenSize = innerWidth - 5; // canvas size
var yScreenSize = innerHeight - 5;
var mapImg;

// type = string continents, states or provinces
function findID(type, id) {
  for (var i = 0; i < stateData[type].length; i++) {
    if (stateData[type][i].id == id) {
      return stateData[type][i];
    }
  }
}

function findClose(type, x, y) {
  var closeDist = Infinity;
  var closeI = 0;
  for (var i = 0; i < stateData[type].length; i++) {
    var nowDist = dist(stateData[type][i].x, stateData[type][i].y, x, y);
    if (nowDist < closeDist) {
      closeDist = nowDist;
      closeI = i;
    }
  }
  return stateData[type][closeI];
}

function renderContinentNames() {
  var infoText = "";
  fill(255)
  stroke(0);
  textAlign(CENTER,CENTER);
  if (stateData.length == 0) {
    infoText = "loading data...";
  } else if (zoom < CONTINENT_MAX_ZOOM) {
    textSize(CONTINENT_TEXT_SIZE);
    strokeWeight(CONTINENT_TEXT_SIZE/5);
    for (var i = 0; i < stateData.continents.length; i++) {
      text(stateData.continents[i].name, stateData.continents[i].x, stateData.continents[i].y)
    }
    var continent = findClose("continents", onMapMousePos[0], onMapMousePos[1]);
    infoText += "name: " + continent.name + "\n"
    infoText += "id: " + continent.id.toString() + "\n"
  } else if (zoom < STATE_MAX_ZOOM) {
    textSize(STATE_TEXT_SIZE);
    strokeWeight(STATE_TEXT_SIZE/5);
    for (var i = 0; i < stateData.states.length; i++) {
      text(stateData.states[i].name, stateData.states[i].x, stateData.states[i].y)
    }
    var state = findClose("states", onMapMousePos[0], onMapMousePos[1]);
    infoText += "name: " + state.name + "\n";
    infoText += "id: " + state.id.toString() + "\n";
    infoText += "continent: " + findID("continents", state.parentID).name + "\n";
  } else {
    textSize(PROVINCE_TEXT_SIZE);
    strokeWeight(PROVINCE_TEXT_SIZE/5);
    for (var i = 0; i < stateData.provinces.length; i++) {
      text(stateData.provinces[i].name, stateData.provinces[i].x, stateData.provinces[i].y)
    }
    var province = findClose("provinces", onMapMousePos[0], onMapMousePos[1]);
    infoText += "name: " + province.name + "\n";
    infoText += "id: " + province.id.toString() + "\n";
    infoText += "state: " + findID("states", province.parentID).name + "\n";
  }
  textAlign(LEFT, TOP)
  textSize(50/zoom)
  strokeWeight(50/zoom/5)
  text(infoText,-camX/zoom,-camY/zoom);
}

function makeName() {
  var a = "aeoiuy";
  var b = "qwrtpsdfghjklzxcvbnm";
  var c = [];
  for (var i = 0; i < a.length; i++) {
    for (var j = 0; j < b.length; j++) {
      c.push(a[i]+b[j]);
    }
  }
  var d = Math.floor(Math.random()*2)+2;
  var e = "";
  if (Math.random() < 0.7) {
    e += b[Math.floor(Math.random()*b.length)];
  }
  for (var i = 0; i < d; i++) {
    e += c[Math.floor(Math.random()*c.length)];
  }
  if (Math.random() < 0.7) {
    e += a[Math.floor(Math.random()*a.length)];
  }
  return e
}

function preload() {
  mapImg = loadImage('Map.png');
}

function setup() { // p5 setup
  createCanvas(xScreenSize, yScreenSize);
  background(255);
  noSmooth();
  noLoop();
  strokeJoin(ROUND)

  redraw();
}

var camX = 250;
var camY = 300;
var zoom = 0.2;

var dragStartX;
var dragStartY;
var dragStartCamX;
var dragStartCamY;

var onMapMousePos = [0,0];

var newStuffText = ""

var conStaProNames = ["continents", "states", "provinces"]

function keyPressed() {
  // if (keyCode === 32) {
  //   var name = prompt("name", makeName())
  //   if (name) {
  //     var type = parseInt(prompt("type",2))
  //     var parentstr = "parentID: \n"
  //     for (var i = 0; i < stateData[conStaProNames[type-1]].length; i++) {
  //       parentstr += stateData[conStaProNames[type-1]][i].name + ": " + stateData[conStaProNames[type-1]][i].id.toString() + "\n";
  //     }
  //     var parent = prompt(parentstr,10)
  //     stateData[conStaProNames[type]].push({"name":name, "x":onMapMousePos[0], "y":onMapMousePos[1], "id":stateData[conStaProNames[type]].length, "parentID":parseInt(parent)})
  //     newStuffText += ',{"name":"' + name + '","x":' + onMapMousePos[0].toString() + ',"y":' + onMapMousePos[1].toString() + ',"id":' + stateData[conStaProNames[type]].length.toString() + ',"parentID":'+ parent + '}'
  //     console.log(newStuffText);
  //   }
  // }
}

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
  // console.log(event.delta);
  if (event.delta > 0) {
    if (zoom > 0.1) {
      var factor = 1-(event.delta/500)
      zoom = zoom * factor
      camX = (camX-mouseX) * factor + mouseX
      camY = (camY-mouseY) * factor + mouseY
    }
  } else {
    if (zoom < 50) {
      var factor = 1-(event.delta/500)
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
  // console.log(zoom);
  renderContinentNames();
  fill(0);
  noStroke();
  ellipse(onMapMousePos[0], onMapMousePos[1], 20/zoom, 20/zoom);
}
