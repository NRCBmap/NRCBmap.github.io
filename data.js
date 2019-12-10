class Continent {
  constructor(x,y,name,sizeOnMap,maxDispSize,states) {
    this.x = x;
    this.y = y;
    this.name = name;
    this.sizeOnMap = sizeOnMap;
    this.maxDispSize = maxDispSize;
    this.states = states;
  }
  render() {
    textSize(this.sizeOnMap);
    if (this.sizeOnMap*zoom < this.maxDispSize) {
      fill(255);
      stroke(0);
    } else {
      renderStates(this.states);
      fill(255,0);
      stroke(0,0);
    }
    strokeWeight(this.sizeOnMap/5)
    text(this.name,this.x,this.y);
  }
}

class State {
  constructor(x,y,sizeOnMap,continent,name,nationOwned,provinces) {
    this.x = x;
    this.y = y;
    this.continent = continent;
    this.sizeOnMap = sizeOnMap;
    this.name = name;
    this.nationOwned = nationOwned;
    this.provinces = provinces;
  }
  render() {
    textSize(this.sizeOnMap);
    if (this.sizeOnMap*zoom < DEF_MAX_TEXT_SIZE) {
      fill(255);
      stroke(0);
    } else {
      renderProvinces(this.provinces);
      fill(255,0);
      stroke(0,0);
    }
    strokeWeight(this.sizeOnMap/5)
    text(this.name,this.x,this.y);
  }
}

class Province {
  constructor(x,y,sizeOnMap,state,name,nationOwned) {
    this.x = x;
    this.y = y;
    this.state = state;
    this.sizeOnMap = sizeOnMap;
    this.name = name;
    this.nationOwned = nationOwned;
  }
  render() {
    textSize(this.sizeOnMap);
    fill(255,255);
    stroke(0,255);
    strokeWeight(this.sizeOnMap/5);
    text(this.name,this.x,this.y);
  }
}

const CONTINENT_MAX_ZOOM = 1;
const CONTINENT_TEXT_SIZE = 100;
const STATE_MAX_ZOOM = 5;
const STATE_TEXT_SIZE = 10;
const PROVINCE_TEXT_SIZE = 2;

var stateData = [];


var url = "http://127.0.0.1:8000/data.json";

var jsonFile = new XMLHttpRequest();
    jsonFile.open("GET",url,true);
    jsonFile.send();

    jsonFile.onreadystatechange = function() {
        if (jsonFile.readyState== 4 && jsonFile.status == 200) {
            stateData = JSON.parse(jsonFile.responseText);
        }
     }
