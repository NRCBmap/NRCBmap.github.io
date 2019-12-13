var mapImg;

// type = string continents, states or provinces
function findID(type, id) {
  for (var i = 0; i < stateData[type].length; i++) {
    if (stateData[type][i].id == id) {
      return stateData[type][i];
    }
  }
}

// type = string continents, states or provinces
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

// id= nation id, found in natOwned of provinces
function getNationInf(id) {
  for (var i = 0; i < stateData.nations.length; i++) {
    if (stateData.nations[i].id == id) {
      return stateData.nations[i]
    }
  }
}

// type = string continents, states or provinces
function getDist(type, id1, id2) {
  var thi1 = findID(type, id1);
  var thi2 = findID(type, id2);
  return dist(thi1.x, thi1.y, thi2.x, thi2.y);
}

// type = string continents, states or provinces
function getThingsInDist(type, x, y, maxDist) {
  var things = [];
  for (var i = 0; i < stateData[type].length; i++) {
    var nowDist = dist(stateData[type][i].x, stateData[type][i].y, x, y);
    if (nowDist < maxDist) {
      things.push(stateData[type][i]);
    }
  }
  return things;
}

var selectedId = 0;
var zoomType = 0;
function renderContinentNames() {
  var infoText = "";
  stroke(0);
  textAlign(CENTER,CENTER);
  if (stateData.length == 0) {
    infoText = "loading data...";
  } else if (zoom < CONTINENT_MAX_ZOOM) {
    zoomType = 0;
    textSize(CONTINENT_TEXT_SIZE);
    strokeWeight(CONTINENT_TEXT_SIZE/5);
    for (var i = 0; i < stateData.continents.length; i++) {
      if (stateData.continents[i].id == selectedId) {
        fill(0,255,0);
      } else {
        fill(255);
      }
      text(stateData.continents[i].name, stateData.continents[i].x, stateData.continents[i].y)
    }
    var continent = findClose("continents", onMapMousePos[0], onMapMousePos[1]);
    selectedId = continent.id;
    infoText += "name: " + continent.name + "\n"
    infoText += "id: " + continent.id.toString() + "\n"
  } else if (zoom < STATE_MAX_ZOOM) {
    zoomType = 1;
    textSize(STATE_TEXT_SIZE);
    strokeWeight(STATE_TEXT_SIZE/5);
    for (var i = 0; i < stateData.states.length; i++) {
      if (stateData.states[i].id == selectedId) {
        fill(0,255,0);
      } else {
        fill(255);
      }
      text(stateData.states[i].name, stateData.states[i].x, stateData.states[i].y)
    }
    var state = findClose("states", onMapMousePos[0], onMapMousePos[1]);
    selectedId = state.id;
    infoText += "name: " + state.name + "\n";
    infoText += "id: " + state.id.toString() + "\n";
    infoText += "continent: " + findID("continents", state.parentID).name + "\n";
  } else {
    zoomType = 2;
    textSize(PROVINCE_TEXT_SIZE);
    strokeWeight(PROVINCE_TEXT_SIZE/5);
    for (var i = 0; i < stateData.provinces.length; i++) {
      if (stateData.provinces[i].id == selectedId) {
        fill(0,255,0);
      } else {
        fill(255);
      }
      text(stateData.provinces[i].name, stateData.provinces[i].x, stateData.provinces[i].y)
    }
    var province = findClose("provinces", onMapMousePos[0], onMapMousePos[1]);
    selectedId = province.id;
    infoText += "name: " + province.name + "\n";
    infoText += "id: " + province.id.toString() + "\n";
    infoText += "state: " + findID("states", province.parentID).name + "\n";
    infoText += "nation: " + getNationInf(province.natOwned).name + "\n";
  }
  textAlign(LEFT, TOP)
  textSize(50/zoom)
  strokeWeight(50/zoom/5)
  fill(255);
  text(infoText,-camX/zoom,-camY/zoom);
}

function extraInfo(type, id) {
  if (type == 2) {
    var province = findID(conStaProNames[type], id);
    var infoText = "Here is some info about " + province.name + ":\n";
    for (const [key, value] of Object.entries(province)) {
      infoText += key + ": ";
      var betterValue = value;
      if (key == "x" || key == "y") {
        betterValue = round(value*100)/100
      } else if (key == "parentID") {
        betterValue = value.toString() + " (" + findID(conStaProNames[type-1], value).name + ")";
      } else if (key == "natOwned") {
        betterValue = value.toString() + " (" + getNationInf(value).name + ")";
      }
      infoText += betterValue.toString() + "\n"
    }
    alert(infoText);
  }
}

var infrastructureId1 = 0;
var infrastructureType = "r";
function infrastructure(id1) {
  if (zoomType != 2) {
    alert("You can only make infrastructure between provinces. Zoom in to select a province. Cancelled");
    return;
  }
  var type = prompt("What type of infrastructure do you want to build?\nr: road\nt: railroad\nc: canal")
  if (type != "r" && type != "t" && type != "c" ) {
    alert("That is not one of the types. The action has been cancelled");
    return;
  }
  infrastructureId1 = id1;
  alert("Click on the province where the infrastructure should go to.")
  tempMouseReleased = function () {
    if (zoomType != 2) {
      alert("That is not a province. Cancelled");
      tempMouseReleased = undefined;
      return;
    }
    var infrastructureId2 = selectedId;
    if (findID("provinces", infrastructureId1).natOwned != findID("provinces", infrastructureId2).natOwned) {
      alert("The two provinces are not owned by the same person. Cancelled")
      tempMouseReleased = undefined;
      return;
    }
    // if (findID("provinces", infrastructureId1).natOwned == 1 || findID("provinces", infrastructureId2).natOwned == 1) {
    //   alert("one or both of the provinces are not owned by anyone. Cancelled")
    //   tempMouseReleased = undefined;
    //   return;
    // }
    var actionCode = "infrastructure;" + getNationInf(findID("provinces", infrastructureId1).natOwned).name + ";" + infrastructureId1.toString() + ";" + infrastructureId2.toString() + ";" + infrastructureType + ";" + ((infrastructureId1+infrastructureId2)%7).toString();
    prompt("copy this code in the #nrmap-codes channel in the discord server.", actionCode)
    tempMouseReleased = undefined;
  }
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
  var xScreenSize = innerWidth - 5;
  var yScreenSize = innerHeight - 5;
  createCanvas(xScreenSize, yScreenSize);
  background(255);
  noSmooth();
  noLoop();
  strokeJoin(ROUND)

  redraw();
}

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
  //     stateData[conStaProNames[type]].push({"name":name, "x":onMapMousePos[0], "y":onMapMousePos[1], "id":stateData[conStaProNames[type]].length, "parentID":parseInt(parent), "natOwned": 1})
  //     newStuffText += ',{"name":"' + name + '","x":' + onMapMousePos[0].toString() + ',"y":' + onMapMousePos[1].toString() + ',"id":' + stateData[conStaProNames[type]].length.toString() + ',"parentID":'+ parent + ',"natOwned": 1}'
  //     console.log(newStuffText);
  //   }
  // }
}

var camX = 250;
var camY = 300;
var zoom = 0.2;

var dragStartX;
var dragStartY;
var dragStartCamX;
var dragStartCamY;
var dragCount = 0;

var onMapMousePos = [0,0];

var newStuffText = ""

var conStaProNames = ["continents", "states", "provinces"]

function mousePressed() {
  dragStartX = mouseX;
  dragStartY = mouseY;
  dragStartCamX = camX;
  dragStartCamY = camY;
  dragCount = 0;
  redraw();
}

function mouseDragged() {
  camX = dragStartCamX - (dragStartX-mouseX)
  camY = dragStartCamY - (dragStartY-mouseY)
  dragCount ++
  redraw();
}

var tempMouseReleased = undefined;

function mouseReleased() {
  if (dragCount < 5) {
    if (tempMouseReleased != undefined) {
      tempMouseReleased();
    } else if (zoomType = 2) {
      var selectedOption = parseInt(prompt("What do you want to do? Tye the number of the option.\n1: extra info\n2: build infrastructure"));
      if (isNaN(selectedOption)) {
        alert("That was not a number");
      } else if (selectedOption == 1) {
        extraInfo(zoomType, selectedId);
      } else if (selectedOption == 2) {
        infrastructure(selectedId);
      }
    }
  }
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
  // if (zoomType == 2) {
  //   var province = findID("provinces", selectedId);
  //   noFill();
  //   stroke(0);
  //   strokeWeight(1);
  //   ellipse(province.x, province.y, 20*2, 20*2);
  //   var things = getThingsInDist("provinces", province.x, province.y, 20);
  //   for (var i = 0; i < things.length; i++) {
  //     line(things[i].x, things[i].y, province.x, province.y);
  //   }
  // }
}
