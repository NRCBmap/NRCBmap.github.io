class Continent {
  constructor(x,y,name,sizeOnMap,maxDispSize,Provinces) {
    this.x = x;
    this.y = y;
    this.name = name;
    this.sizeOnMap = sizeOnMap;
    this.maxDispSize = maxDispSize;
    this.Provinces = Provinces;
  }
  render() {
    textSize(this.sizeOnMap);
    if (this.sizeOnMap*zoom < this.maxDispSize) {
      fill(255);
      stroke(0);
    } else {
      renderProvinces(this.Provinces);
      fill(255,0);
      stroke(0,0);
    }
    strokeWeight(this.sizeOnMap/10)
    text(this.name,this.x,this.y);
  }
}

class Province {
  constructor(x,y,sizeOnMap,minDispSize,maxDispSize,continent,nationOwned) {
    this.x = x;
    this.y = y;
    this.continent = continent;
    this.sizeOnMap = sizeOnMap;
    this.nationOwned = nationOwned;
  }
  render() {
    textSize(this.sizeOnMap);
    fill(255,255);
    stroke(0,255);
    strokeWeight(this.sizeOnMap/10);
    text(this.nationOwned,this.x,this.y);
  }
}

const CONTINTNENT_TEXT_SIZE = 100;
const PROVINCE_TEXT_SIZE = CONTINTNENT_TEXT_SIZE/5;
const DEF_MAX_TEXT_SIZE = 100;
const DEF_MIN_TEXT_SIZE = DEF_MAX_TEXT_SIZE/5;

var continents = [new Continent(4100,1750,"The long boi",CONTINTNENT_TEXT_SIZE,DEF_MAX_TEXT_SIZE,[]),
                  new Continent(3200,800,"The smol boi",CONTINTNENT_TEXT_SIZE,DEF_MAX_TEXT_SIZE, []),
                  new Continent(4350,700,"The rough boi",CONTINTNENT_TEXT_SIZE,DEF_MAX_TEXT_SIZE, []),
                  new Continent(600,600,"The double boi",CONTINTNENT_TEXT_SIZE,DEF_MAX_TEXT_SIZE, []),
                  new Continent(1500,1000,"The big boi",CONTINTNENT_TEXT_SIZE,DEF_MAX_TEXT_SIZE, [])];
