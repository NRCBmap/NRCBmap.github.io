const CONTINENT_MAX_ZOOM = 1;
const CONTINENT_TEXT_SIZE = 100;
const STATE_MAX_ZOOM = 5;
const STATE_TEXT_SIZE = 10;
const PROVINCE_TEXT_SIZE = 2;

var stateData = [];


var url = "https://codemaker4.github.io/NRCBmap/data.json";

var jsonFile = new XMLHttpRequest();
    jsonFile.open("GET",url,true);
    jsonFile.send();

    jsonFile.onreadystatechange = function() {
        if (jsonFile.readyState== 4 && jsonFile.status == 200) {
            stateData = JSON.parse(jsonFile.responseText);
        }
     }
