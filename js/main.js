var map;



function createMap(){
   
    var southWest = new L.LatLng(40.59, -104.38);
    var northEast = new L.LatLng(48.76, -75.39);
    var bounds = new L.LatLngBounds(southWest, northEast);

    map = L.map('mapid', {
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
    getData2(map);
    getData3(map);
    getData4(map);
    getData5(map);
    getData6(map);
    getData(map);

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
        radius: 6,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
    for (var i = 0; i < data.features.length; i++){
        // console.log(data.features[i].properties.TOTAL_AC);
    }
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            var fires_100 = L.circleMarker(latlng, geojsonMarkerOptions)
            var fAcres = feature.properties.TOTAL_AC;
            var fDate = feature.properties.FIREDATE;
            fires_100.bindPopup("<b>Date of fire: </b>" + fDate + "<br><b>Total area burned: </b>" + fAcres);
            return fires_100
        }
    }).bringToFront().addTo(map);
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

function addCounties (data, map){
    var cntyOptions = {
        weight: 1,
        opacity: .8,
        fillOpacity: 0,
        color: '#636363',
    }
    var cntyBnds = new L.geoJson(data, cntyOptions);
    $('input[value="cntyBnds"]').on('change', function() {
        var cntyCheck = document.querySelector('input[value="cntyBnds"]');
        if (cntyCheck.checked){
            cntyBnds.addTo(map);
            cntyBnds.bringToBack();
        }
        if (!cntyCheck.checked){
            map.removeLayer(cntyBnds);
        }
    });
    
}


function addPreVeg (data, map){
    var vegOptions = {
        weight: 1,
        opacity: .8,
        fillOpacity: 0,
        color: '#636363',
    }
    var ogVeg = new L.geoJson(data, vegOptions);
    $('input[value="ogVeg"]').on('change', function() {
        var ogVegCheck = document.querySelector('input[value="ogVeg"]');
        if (ogVegCheck.checked){
            ogVeg.addTo(map);
        }
        if (!ogVegCheck.checked){
            map.removeLayer(ogVeg);
        }
    });
    
}

function fireResponse (data, map){
    var responseOptions = {
        weight: 1,
        opacity: .8,
        fillOpacity: 0,
        color: '#636363',
    }
    var fResponseUnits = new L.geoJson(data, responseOptions);
    $('input[value="fResponse"]').on('change', function() {
        var responseCheck = document.querySelector('input[value="fResponse"]');
        if (responseCheck.checked){
            fResponseUnits.addTo(map);
        }
        if (!responseCheck.checked){
            map.removeLayer(fResponseUnits);
        }
    });
    
}
function fireProtect (data, map){
    var protectOptions = {
        weight: 1,
        opacity: .8,
        fillOpacity: 0,
        color: '#636363',
    }
    var protectAreas = new L.geoJson(data, protectOptions);
    $('input[value="fProtect"]').on('change', function() {
        var protCheck = document.querySelector('input[value="fProtect"]');
        if (protCheck.checked){
            protectAreas.addTo(map);
        }
        if (!protCheck.checked){
            map.removeLayer(protectAreas);
        }
    });
    
}
function getData(map){
    $.ajax("data/fires_100_final.geojson", {
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
    $.ajax("data/WI_bnds.json", {
        dataType: "json",
        success: function(response){
            addCounties(response, map);
        }
    })
}
function getData4(map){
    $.ajax("data/og_veg_poly.geojson", {
        dataType: "json",
        success: function(response){
            addPreVeg(response, map);
        }
    })
}
function getData5(map){
    $.ajax("data/fire_response.geojson", {
        dataType: "json",
        success: function(response){
            fireResponse(response, map);
        }
    })
}
function getData6(map){
    $.ajax("data/protection_areas.geojson", {
        dataType: "json",
        success: function(response){
            fireProtect(response, map);
        }
    })
}

$(document).ready(createMap);