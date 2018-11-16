var map;
var cntyBnds;
var protectAreas;
var fResponseUnits;
var firePolys;
var firePoint;
function createMap(){

    var southWest = new L.LatLng(40.59, -104.38);
    var northEast = new L.LatLng(48.76, -75.39);
    var bounds = new L.LatLngBounds(southWest, northEast);

    map = L.map('mapid', {
    center: [44.74, -89.64],
    zoom: 3,
    minZoom: 7,
    maxZoom: 12,
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
    getData7(map);
    removeBoundaries(map);

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
        fillColor: "#8856a7",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };
    for (var i = 0; i < data.features.length; i++){
        // console.log(data.features[i].properties.TOTAL_AC);
    }
    firePoint = L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            var fires_100 = L.circleMarker(latlng, geojsonMarkerOptions)
            var fAcres = feature.properties.TOTAL_AC;
            var fDate = feature.properties.FIREDATE;
            var zoom = map.getZoom();
            if (fAcres < 200){
                fires_100.setRadius(6);
            }
            if (fAcres < 350 && fAcres > 200){
                fires_100.setRadius(8);
            }
            if (fAcres < 600 && fAcres > 350){
                fires_100.setRadius(10);
            }
            if (fAcres < 2000 && fAcres > 600){
                fires_100.setRadius(12);
            }
            if (fAcres > 2000){
                fires_100.setRadius(14);
            }
            fires_100.bindPopup("<b>Date of fire: </b>" + fDate + "<br><b>Total area burned: </b>" + fAcres + " acres");

            fires_100.on('click', function(e){
                if (map.getZoom() < 10){
                    map.setView(e.latlng, 9);
                }
                else{
                    map.setView(e.latlng);
                }

            });
            return fires_100
        }
    });
    $('input[value="fire100"]').on('change', function() {
        var cntyCheck = document.querySelector('input[value="fire100"]');
        if (cntyCheck.checked){
            firePoint.addTo(map);
        }
        if (!cntyCheck.checked){
            map.removeLayer(firePoint);
        }
    });

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

function removeBoundaries (map){
    $('input[type=radio][value="clearLayer"]').change(function() {
        map.removeLayer(fResponseUnits);
        map.removeLayer(protectAreas);
        map.removeLayer(cntyBnds);
    });
}


function addCounties (data, map){
    var cntyOptions = {
        weight: 1,
        opacity: .8,
        fillOpacity: 0,
        color: '#636363',
    }
    cntyBnds = new L.geoJson(data, cntyOptions);

    $('input[type=radio][value="cntyBnds"]').change(function() {
        map.removeLayer(fResponseUnits);
        map.removeLayer(protectAreas);
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
    fResponseUnits = new L.geoJson(data, responseOptions);
    $('input[value="fResponse"]').on('change', function() {
        map.removeLayer(cntyBnds);
        map.removeLayer(protectAreas);
        var responseCheck = document.querySelector('input[value="fResponse"]');
        if (responseCheck.checked){
            fResponseUnits.addTo(map);
            fResponseUnits.bringToBack();
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
    protectAreas = new L.geoJson(data, protectOptions);
    $('input[value="fProtect"]').on('change', function() {
        map.removeLayer(cntyBnds);
        map.removeLayer(fResponseUnits);
        var protCheck = document.querySelector('input[value="fProtect"]');
        if (protCheck.checked){
            protectAreas.addTo(map);
            protectAreas.bringToBack();
        }
        if (!protCheck.checked){
            map.removeLayer(protectAreas);
        }
    });

}

function addFirePolys(data, map) {
    var firepolyOptions = {
        weight: 1,
        opacity: .8,
        fillOpacity: .8,
        color: '#de2d26',
    }
    firePolys = new L.geoJson(data, firepolyOptions);
    firePolys.addTo(map);
    $('input[value="firepoly"]').on('change', function() {
        var cntyCheck = document.querySelector('input[value="firepoly"]');
        if (cntyCheck.checked){
            firePolys.addTo(map);
            firePoint.bringToFront();
        }
        if (!cntyCheck.checked){
            map.removeLayer(firePolys);
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
function getData7(map){
    $.ajax("data/historic_fires_polys.geojson", {
        dataType: "json",
        success: function(response){
            addFirePolys(response, map);
        }
    })
}
// function layerCheck(map){
//   var dLayers = L.layerGroup()
//   if (map.hasLayer(firePoint)){
//       dlayers.addLayer(firePoint)
//   }
//   if (map.hasLayer(fResponseUnits)){
//       dlayers.addLayer(fResponseUnits)
//   }
//   if (map.hasLayer(protectAreas)){
//       dlayers.addLayer(protectAreas)
//   }
//   if (map.hasLayer(cntyBnds)){
//       dlayers.addLayer(cntyBnds)
//   }
//   if (map.hasLayer(ogVeg)){
//       dlayers.addLayer(ogVeg)
//   }
//   if (map.hasLayer(firePolys)){
//       dlayers.addLayer(firePolys)
//   }
// }
$("#dwn").on('click', function(e){
    map.fire('modal', {
      content: '<div id="download" class="modal"><div class="modal-header"><h1>Download Layers</h1><p>Are you sure you want to download the following layers?</p><button id="dwnload">Yes</button></div></div>'
    });
    $("#dwnload").on('click',function(e){
        window.alert("This button works!")
    });
  });

$(document).ready(createMap);

$(window).on('load', function(){
    map.fire('modal', {
      content: '<div id="start" class="modal""><div class="modal-header"><h1 style="text-align: center">Wisconsin on Fire</h1><h2 style="text-align: center">An exploratory history of wildfire in Wisconsin</h2></div></div>'
    });
});
