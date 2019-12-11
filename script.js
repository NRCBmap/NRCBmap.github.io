var xScreenSize = innerWidth - 5; // canvas size
var yScreenSize = innerHeight - 5;
var mapImg;

function renderContinentNames() {
  if (stateData.length == 0) {
    return;
  }
  var infoText = "";
  if (zoom < CONTINENT_MAX_ZOOM) {
    fill(255)
    textSize(CONTINENT_TEXT_SIZE);
    strokeWeight(CONTINENT_TEXT_SIZE/5);
    stroke(0);
    textAlign(CENTER,CENTER);
    var closestI = 0;
    var closestDist = Infinity;
    for (var i = 0; i < stateData.continents.length; i++) {
      text(stateData.continents[i].name, stateData.continents[i].x, stateData.continents[i].y)
      var nowDist = dist(onMapMousePos[0], onMapMousePos[1], stateData.continents[i].x, stateData.continents[i].y)
      if (nowDist < closestDist) {
        closestDist = nowDist;
        closestI = i;
      }
    }
    var continent = stateData.continents[closestI]
    infoText += "name: " + continent.name + "\n"
    infoText += "id: " + continent.id.toString() + "\n"
  } else if (zoom < STATE_MAX_ZOOM) {
    fill(255)
    textSize(STATE_TEXT_SIZE);
    strokeWeight(STATE_TEXT_SIZE/5);
    stroke(0);
    textAlign(CENTER,CENTER);
    var closestI = 0;
    var closestDist = Infinity;
    for (var i = 0; i < stateData.states.length; i++) {
      text(stateData.states[i].name, stateData.states[i].x, stateData.states[i].y)
      var nowDist = dist(onMapMousePos[0], onMapMousePos[1], stateData.states[i].x, stateData.states[i].y)
      if (nowDist < closestDist) {
        closestDist = nowDist;
        closestI = i;
      }
    }
    var state = stateData.states[closestI];
    infoText += "name: " + state.name + "\n";
    infoText += "id: " + state.id.toString() + "\n";
    for (var i = 0; i < stateData.continents.length; i++) {
      if (stateData.continents[i].id == state.parentID) {
        infoText += "continent: " + stateData.continents[i].name + "\n";
      }
    }
  } else {
    fill(255)
    textSize(PROVINCE_TEXT_SIZE);
    strokeWeight(PROVINCE_TEXT_SIZE/5);
    stroke(0);
    textAlign(CENTER,CENTER);
    var closestI = 0;
    var closestDist = Infinity;
    for (var i = 0; i < stateData.provinces.length; i++) {
      text(stateData.provinces[i].name, stateData.provinces[i].x, stateData.provinces[i].y)
      var nowDist = dist(onMapMousePos[0], onMapMousePos[1], stateData.provinces[i].x, stateData.provinces[i].y)
      if (nowDist < closestDist) {
        closestDist = nowDist;
        closestI = i;
      }
    }
    var province = stateData.provinces[closestI];
    infoText += "name: " + province.name + "\n";
    infoText += "id: " + province.id.toString() + "\n";
    for (var i = 0; i < stateData.states.length; i++) {
      if (stateData.states[i].id == province.parentID) {
        infoText += "state: " + stateData.states[i].name + "\n";
      }
    }
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
  //     var parent = prompt(parentstr,8)
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
  // console.log(zoom);
  renderContinentNames();
  fill(0);
  noStroke();
  ellipse(onMapMousePos[0], onMapMousePos[1], 20/zoom, 20/zoom);
}
