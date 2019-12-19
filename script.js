var mapImg;

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

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
var attentionIds = [];
var zoomType = 0;
function renderContinentNames() {
  if (zoomType == 2) {
    for (var i = 0; i < stateData.infrastructure.length; i++) {
      var pr1 = findID('provinces', stateData.infrastructure[i].pr1);
      var pr2 = findID('provinces', stateData.infrastructure[i].pr2);

      if (checkOnScreen(pr1.x, pr1.y) || checkOnScreen(pr2.x, pr2.y)) {
        var moveFac = 0
        if (stateData.infrastructure[i].type == 'r') { // road
          stroke(150, 70, 0, 127);
        } else if (stateData.infrastructure[i].type == 'c') {// canal
          stroke(0, 127, 255, 127);
          moveFac = 1;
        } else { // railroad
          stroke(127, 127);
          moveFac = -1;
        }
        var xFac1 = (pr1.name.length/1.5)+1;
        var xFac2 = (pr2.name.length/1.5)+1;
        var yFac = 1.5;
        var dir = -atan2(pr2.x-pr1.x, pr2.y-pr1.y);
        strokeWeight(1);
        line(pr1.x+(sin(-dir)*xFac1)+(cos(dir)*moveFac)-0.5,
             pr1.y+(cos(-dir)*yFac )+(sin(dir)*moveFac)-0.5,
             pr2.x-(sin(-dir)*xFac2)+(cos(dir)*moveFac)-0.5,
             pr2.y-(cos(-dir)*yFac )+(sin(dir)*moveFac)-0.5);
      }
    }
  }

  var infoText = "";
  stroke(0);
  textAlign(CENTER,CENTER);
  if (stateData.length == 0) {
    infoText = "loading data...\nplease notify\n@codemaker4\nif this takes more than \na few seconds.\n";
  } else if (zoom < CONTINENT_MAX_ZOOM) {
    zoomType = 0;
    textSize(CONTINENT_TEXT_SIZE);
    strokeWeight(CONTINENT_TEXT_SIZE/5);
    for (var i = 0; i < stateData.continents.length; i++) {
      if (attentionIds.includes("continents;" + stateData.continents[i].id.toString())) {
        fill(0,127,255);
      } else if (stateData.continents[i].id == selectedId) {
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
      if (attentionIds.includes("states;" + stateData.states[i].id.toString())) {
        fill(0,127,255);
      } else if (stateData.states[i].id == selectedId) {
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
      if (checkOnScreen(stateData.provinces[i].x, stateData.provinces[i].y)) {
        if (attentionIds.includes("provinces;" + stateData.provinces[i].id.toString())) {
          fill(0,127,255);
        } else if (stateData.provinces[i].id == selectedId) {
          fill(0,255,0);
        } else {
          fill(255);
        }
        text(stateData.provinces[i].name, stateData.provinces[i].x, stateData.provinces[i].y)
      }
    }
    var province = findClose("provinces", onMapMousePos[0], onMapMousePos[1]);
    selectedId = province.id;
    infoText += "name: " + province.name + "\n";
    infoText += "id: " + province.id.toString() + "\n";
    infoText += "state: " + findID("states", province.parentID).name + "\n";
    infoText += "nation: " + getNationInf(province.natOwned).name + "\n";
  }
  fill(0,0,0,150);
  rectMode(CORNER);
  strokeWeight(0)
  rect(-camX/zoom,-camY/zoom,500/zoom,60*(infoText.split("\n").length-1)/zoom);
  textAlign(LEFT, TOP);
  textSize(50/zoom);
  strokeWeight(50/zoom/5);
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
        betterValue = getNationInf(value).name + "\n";
        betterValue += " - " + getNationInf(value).description + "\n";
        betterValue += " - " + getNationInf(value)["discord tag"];
      } else if (key == "colonyId") {
        for (var i = 0; i < getNationInf(province.natOwned).colonies.length; i++) {
          if (getNationInf(province.natOwned).colonies[i].id == province.colonyId) {
            betterValue = getNationInf(province.natOwned).colonies[i].name;
            break;
          }
        }
      }
      infoText += betterValue.toString() + "\n"
    }
    infoText += "infrastructure:\n";
    for (var i = 0; i < stateData.infrastructure.length; i++) {
      var nowR = stateData.infrastructure[i]
      var otherId = false;
      if (nowR.pr1 == id) {
        otherId = nowR.pr2;
      } else if (nowR.pr2 == id) {
        otherId = nowR.pr1;
      }
      if (otherId) {
        infoText += ' - '
        if (nowR.type == 'r') { // road
          infoText += 'Road';
        } else if (nowR.type == 'c') { // canal
          infoText += 'Canal';
        } else {
          infoText += 'Railroad';
        }
        infoText += ' to ' + findID('provinces', otherId).name + '\n';
      }
    }
    alert(infoText);
  } else if (type == 1) {
    var state = findID(conStaProNames[type], id);
    var infoText = "Here is some info about " + state.name + ":\n";
    for (const [key, value] of Object.entries(state)) {
      infoText += key + ": ";
      var betterValue = value;
      if (key == "x" || key == "y") {
        betterValue = round(value*100)/100
      } else if (key == "parentID") {
        betterValue = value.toString() + " (" + findID(conStaProNames[type-1], value).name + ")";
      }
      infoText += betterValue.toString() + "\n"
    }
    alert(infoText);
  } else if (type == 0) {
    var continent = findID(conStaProNames[type], id);
    var infoText = "Here is some info about " + continent.name + ":\n";
    for (const [key, value] of Object.entries(continent)) {
      infoText += key + ": ";
      var betterValue = value;
      if (key == "x" || key == "y") {
        betterValue = round(value*100)/100
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
    if (findID("provinces", infrastructureId1).natOwned == 1 || findID("provinces", infrastructureId2).natOwned == 1) {
      alert("one or both of the provinces are not owned by anyone. Cancelled")
      tempMouseReleased = undefined;
      return;
    }
    var actionCode = "infrastructure " + getNationInf(findID("provinces", infrastructureId1).natOwned).name + ";" + infrastructureId1.toString() + ";" + infrastructureId2.toString() + ";" + infrastructureType + ";" + ((infrastructureId1+infrastructureId2)%7).toString();
    prompt("copy this code in the #nrmap-codes channel in the discord server.", actionCode)
    tempMouseReleased = undefined;
  }
}

function colonise(provinceID) {
  var nationColonising = userFindNation();
  if (!nationColonising) {
    alert("cancelled");
    return
  }
  var colonyId = false;
  while (!colonyId) {
    var promptText = "Give the colony name. Press space and select make colony to make a new colony.\nyour colonies:\n";
    for (var i = 0; i < nationColonising.colonies.length; i++) {
      promptText += " - " + nationColonising.colonies[i].name + "\n";
    }
    var colonyName = prompt(promptText, "main");
    if (!colonyName) {
      alert("cancelled");
      return
    }
    for (var i = 0; i < nationColonising.colonies.length; i++) {
      if (nationColonising.colonies[i].name == colonyName) {
        colonyId = nationColonising.colonies[i].id;
        break;
      }
    }
    if (!colonyId) {
      alert("could not find that colony. Check the spelling.")
    }
  }
  var provinceColonised = findID('provinces', provinceID);
  var cmdText = "colonise ";
  // colonise <provinceId>;<nationId>;<colonyId>;<confnum (sum%7)>
  cmdText += provinceColonised.id.toString() + ";";
  cmdText += nationColonising.id.toString() + ";";
  cmdText += colonyId.toString() + ";";
  cmdText += ((provinceColonised.id + nationColonising.id + colonyId)%7).toString();
  cmdText += "\nhttps://codemaker4.github.io/NRCBmap/?script=setCamToThing('provinces'," + provinceColonised.id.toString() + ");"
  prompt("Paste this in #nrmap-codes", cmdText);
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

  if (getUrlVars().script != undefined) {
    eval(decodeURIComponent(getUrlVars().script));
  }

  redraw();
}

function userFindNation(){
  var nation = false;
  while (!nation) {
    var natName = prompt("Give the name, #id or discord name of the nation.");
    if (!natName) {
      return false;
    }
    for (var i = 0;i < stateData.nations.length;i++) {
      if (stateData.nations[i].name == natName || parseInt(stateData.nations[i].id) == natName || stateData.nations[i]["discord tag"] == natName) {
        nation = stateData.nations[i]
      }
    }
  }
  return nation
}

function alertNatInf(province) {
  if (province == "#search") {
    var nation = userFindNation();
    if (!nation) {
      alert("cancelled");
      return
    }
  } else {
    var nation = getNationInf(findID('provinces', province).natOwned);
  }
  var infoText = "Here is some info about " + nation.name + ". On the bottom there are some options for extra info.\n"
  for (const [key, value] of Object.entries(nation)) {
    if (key == "colonies") {
      infoText += "colony names:\n";
      for (var i = 0; i < value.length; i++) {
        infoText += " - " + value[i].name + "\n";
      }
    } else {
      infoText += key + ": " + value.toString() + "\n";
    }
  }
  infoText += "options:\n1: goto capital"
  option = parseInt(prompt(infoText));
  if (!isNaN(option)) {
    if (option == 1) {
      alert("still being made.......")
    }
  }
}

function options() {
  var input = prompt("What do you want to do?\n1: get info about a nation\n2: share location");
  if (input == "1") {
    alertNatInf("#search")
  } else if (input == "2") {
    shareLoc();
  } else {
    alert("That was not an option.")
  }
}

function keyPressed() {
  if (keyCode == 32) {
    options();
  }
  if (keyCode === 78) { // n
    var name = prompt("name", makeName())
    if (name) {
      var type = parseInt(prompt("type",2))
      var parentstr = "parentID: \n"
      for (var i = 0; i < stateData[conStaProNames[type-1]].length; i++) {
        parentstr += stateData[conStaProNames[type-1]][i].name + ": " + stateData[conStaProNames[type-1]][i].id.toString() + "\n";
      }
      var parent = prompt(parentstr,10)
      stateData[conStaProNames[type]].push({"name":name, "x":onMapMousePos[0], "y":onMapMousePos[1], "id":stateData[conStaProNames[type]].length, "parentID":parseInt(parent), "natOwned": 1})
      newStuffText += ',{"name":"' + name + '","x":' + onMapMousePos[0].toString() + ',"y":' + onMapMousePos[1].toString() + ',"id":' + stateData[conStaProNames[type]].length.toString() + ',"parentID":'+ parent + ',"natOwned": 1}'
      console.log(newStuffText);
    }
  }
}

var camX = 250;
var camY = 300;
var zoom = 0.2;

var goalCamX = 0;
var goalCamY = 0;
var goalZoom = 1;
var movingToGoal = false;

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
  movingToGoal = false;
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
    } else if (zoomType == 2) {
      var selectedOption = parseInt(prompt("What do you want to do? Tye the number of the option.\n1: extra info\n2: build infrastructure.\n3: get nation info.\n4: colonise"));
      if (isNaN(selectedOption)) {
        alert("That was not a number");
      } else if (selectedOption == 1) {
        extraInfo(zoomType, selectedId);
      } else if (selectedOption == 2) {
        infrastructure(selectedId);
      } else if (selectedOption == 3) {
        alertNatInf(selectedId);
      } else if (selectedOption == 4) {
        colonise(selectedId);
      }
    } else if (zoomType == 1) {
      var selectedOption = parseInt(prompt("What do you want to do? Tye the number of the option.\n1: extra info"));
      if (isNaN(selectedOption)) {
        alert("That was not a number");
      } else if (selectedOption == 1) {
        extraInfo(zoomType, selectedId);
      }
    } else if (zoomType == 0) {
      var selectedOption = parseInt(prompt("What do you want to do? Tye the number of the option.\n1: extra info"));
      if (isNaN(selectedOption)) {
        alert("That was not a number");
      } else if (selectedOption == 1) {
        extraInfo(zoomType, selectedId);
      }
    }
  }
}

function mouseMoved() {
  if (!movingToGoal) {
    redraw();
  }
}

function mouseWheel(event) {
  // console.log(event.delta);
  movingToGoal = false;
  if (event.delta > 0) {
    if (zoom > 0.02) {
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

function windowResized() {
  var xScreenSize = innerWidth - 5;
  var yScreenSize = innerHeight - 5;
  resizeCanvas(xScreenSize, yScreenSize);
}

function getOnMapPos(x,y) {
  return ([(-camX+x)/zoom, (-camY+y)/zoom]);
}

function getOnScreenPos(x,y) {
  return ([(x*zoom)+camX, (y*zoom)+camY]);
}

function checkOnScreen(x,y) {
  var onScreenPos = getOnScreenPos(x,y);
  return (onScreenPos[0]>=0 && onScreenPos[0]<width && onScreenPos[1]>=0 && onScreenPos[1]<height);
}

function doCamMove() {
  if (movingToGoal) {
    camX -= (camX-goalCamX)/50;
    camY -= (camY-goalCamY)/50;
    zoom -= (zoom-goalZoom)/50;
    if (abs(camX-goalCamX)*zoom < 0.1 && abs(camY-goalCamY)*zoom < 0.1 && abs(zoom-goalZoom) < 0.01) {
      movingToGoal = false;
    }
  } else {
    noLoop();
  }
}

function shareLoc() {
  var newX = (-camX/zoom) + (width/zoom/2);
  console.log(newX, camX, width, zoom);
  var newY = (-camY/zoom) + (height/zoom/2);
  console.log(newY, camY);
  prompt("Share this link to automatically go to the same location:", "codemaker4.github.io/NRCBmap/?script=setCamTo(" + newX.toString() + "," + newY.toString() + "," + zoom.toString() + ")");
}

function setCamTo(newX,newY,newZoom) {
  var tempZoom = zoom;
  zoom = newZoom;
  var onScreenPos = getOnScreenPos(newX, newY);
  goalCamX = camX - (onScreenPos[0]-(width/2));
  goalCamY = camY - (onScreenPos[1]-(height/2));
  zoom = tempZoom;
  goalZoom = newZoom;
  movingToGoal = true;
  loop();
}

function setCamToThing(type, id) {
  if (type == 'provinces') {
    var newZoom = 15;
  } else if (type == 'states') {
    var newZoom = 4.9;
  } else if (type == 'continents'){
    var newZoom = 0.5
  } else if (type == 'infrastructure') {
    var newZoom = 10;
  }
  if (type == 'provinces' || type == 'states' || type == 'continents') {
    setCamTo(findID(type, id).x, findID(type, id).y, newZoom)
    // var tempZoom = zoom;
    // zoom = goalZoom;
    // var onScreenPos = getOnScreenPos(findID(type, id).x, findID(type, id).y)
    // goalCamX = camX - (onScreenPos[0]-(width/2));
    // goalCamY = camY - (onScreenPos[1]-(height/2));
    // zoom = tempZoom;
    // movingToGoal = true;
    attentionIds = [type.toString() + ";" + id.toString()]
    // loop();
  } else if (type == 'infrastructure') {
    // var tempZoom = zoom;
    // zoom = goalZoom;
    var infrastructure = findID('infrastructure', id);
    var pr1 = findID('provinces', infrastructure.pr1);
    var pr2 = findID('provinces', infrastructure.pr2);
    setCamTo((pr1.x + pr2.x)/2, (pr1.y + pr2.y)/2, newZoom);
    // var onScreenPos1 = getOnScreenPos(findID('provinces', pr1Id).x, findID('provinces', pr1Id).y);
    // var onScreenPos2 = getOnScreenPos(findID('provinces', pr2Id).x, findID('provinces', pr2Id).y);
    // var onScreenPos = [(onScreenPos1[0] + onScreenPos2[0])/2, (onScreenPos1[1] + onScreenPos2[1])/2];
    // goalCamX = camX - (onScreenPos[0]-(width/2));
    // goalCamY = camY - (onScreenPos[1]-(height/2));
    // zoom = tempZoom;
    // movingToGoal = true;
    attentionIds = ["provinces;" + pr1.id.toString(), "provinces;" + pr2.id.toString()]
    // loop();
  }
}

function draw() {
  onMapMousePos = getOnMapPos(mouseX, mouseY);
  doCamMove();
  background(68,107,164);
  translate(camX, camY);
  scale(zoom);
  image(mapImg,0,0);
  renderContinentNames();

  // fill(0);
  // noStroke();
  // ellipse(onMapMousePos[0], onMapMousePos[1], 5/zoom, 5/zoom);

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
