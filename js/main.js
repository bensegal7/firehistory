function createMap(){
   
    var southWest = new L.LatLng(40.59, -104.38);
    var northEast = new L.LatLng(48.76, -75.39);
    var bounds = new L.LatLngBounds(southWest, northEast);

    var map = L.map('mapid', {
    center: [44.74, -89.64],
    zoom: 3,
    minZoom: 7,
    maxZoom: 11,
    maxBounds: bounds,
    zoomControl: false
    });


    var streets = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYmVuc2VnYWwiLCJhIjoiY2ppa2d3YXV6MDEzazNwcWdqanl0enlkbSJ9.5NAeMpJqphfWKI_xkABQEQ', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiYmVuc2VnYWwiLCJhIjoiY2ppa2d3YXV6MDEzazNwcWdqanl0enlkbSJ9.5NAeMpJqphfWKI_xkABQEQ'
    }).addTo(map);
    var satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYmVuc2VnYWwiLCJhIjoiY2ppa2d3YXV6MDEzazNwcWdqanl0enlkbSJ9.5NAeMpJqphfWKI_xkABQEQ', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.satellite',
        accessToken: 'pk.eyJ1IjoiYmVuc2VnYWwiLCJhIjoiY2ppa2d3YXV6MDEzazNwcWdqanl0enlkbSJ9.5NAeMpJqphfWKI_xkABQEQ'
    });
    var baseMaps = {
        "Satellite": satellite,
        "Streets": streets
    };
    var baseControl = L.control.layers(baseMaps).addTo(map); 
    var resetZoom = new L.Control.ZoomMin({
        position: 'topright'
    });
    map.addControl(resetZoom);
    
    

    sidebar(map);
    getData(map);
    getData2(map);

};

function sidebar(mymap) {
    var sidebar = L.control.sidebar({
        autopan: true,       // whether to maintain the centered map point when opening the sidebar
        closeButton: false,    // whether t add a close button to the panes
        container: 'sidebar', // the DOM container or #ID of a predefined sidebar container that should be used
        position: 'left',     // left or right
    }).addTo(mymap);  
}

function pointFire (data, map) {
    var geojsonMarkerOptions = {
        radius: 100,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            console.log(latlng);
            return L.circleMarker(latlng, geojsonMarkerOptions)
        }
    }).addTo(map);
}

function addState (data, map){
    var stateOptions = {
        weight: 2,
        opacity: .8,
        fillOpacity: .2,
        color: '#636363',
    }
    var wiBounds = L.geoJson(data, stateOptions);
    wiBounds.addTo(map);

}

function getData(map){
    $.ajax("data2/fire_100_wgs84.json", {
        dataType: "json",
        success: function(response){
            pointFire(response, map);
        }
    })
}
function getData2(map){
    $.ajax("data/statebounds500.geojson", {
        dataType: "json",
        success: function(response){
            addState(response, map);
        }
    })
}
function getData3(map){
    $.ajax("data/statebounds500.geojson", {
        dataType: "json",
        success: function(response){
            addState(response, map);
        }
    })
}

$(document).ready(createMap);