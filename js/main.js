var map;
var cntyBnds;
var protectAreas;
var fResponseUnits;
var firePolys;
var firePoint;
var currentLandCover;
var ogVeg;
var fires_100;
var zoom;
var opacitySlider = new L.Control.opacitySlider();
dragElement(document.getElementById(("polyInfoSidebar")));

function dragElement(elmnt) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        /* if present, the header is where you move the DIV from:*/
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

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
    getLandCov(map);
    removeBoundaries(map);

};
function getLandCov(map){

    $('input[value="landcov"]').on('change', function(){
        map.removeControl(opacitySlider);
        var landchecked = document.querySelector('input[value="landcov"]');
        if (landchecked.checked){
            map.removeLayer(ogVeg);
            currentLandCover = L.tileLayer('tiles/modernland_cover/{z}/{x}/{y}.png', {
            }).addTo(map).bringToFront();
            map.addControl(opacitySlider);
            opacitySlider.setOpacityLayer(currentLandCover);
            $("#bio").removeClass("disabled");
            sidebar.open('biophysical')
        }
        if (!landchecked.checked){
            map.removeLayer(currentLandCover);
        }
    })

}

function sidebar(mymap) {
    sidebar = L.control.sidebar({
        autopan: true,       // whether to maintain the centered map point when opening the sidebar
        closeButton: false,    // whether t add a close button to the panes
        container: 'sidebar', // the DOM container or #ID of a predefined sidebar container that should be used
        position: 'left',     // left or right
    }).addTo(mymap);
    sidebar.open('home');
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


    map.on('moveend', function(e) {
        firePoint = L.geoJson(data, {
            pointToLayer: function(feature, latlng){
                fires_100 = L.circleMarker(latlng, geojsonMarkerOptions)
                var fAcres = feature.properties.TOTAL_AC;
                var fDate = feature.properties.FIREDATE;
                zoom = map.getZoom();
                
                fires_100.setRadius(Math.pow(fAcres, .4));
                zoom = map.getZoom();
                console.log(zoom);
                
               
                fires_100.bindPopup("<b>Date of fire: </b>" + fDate + "<br><b>Total area burned: </b>" + fAcres + " acres");
    
                fires_100.on('click', function(e){
                    if (zoom < 10){
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
                $("#future").removeClass("disabled");
                sidebar.open('trends')
            }
            if (!cntyCheck.checked){
                map.removeLayer(firePoint);
                $("#future").addClass("disabled");
            }
        });
    });
    

}

function pointChange (point) {

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
    $('input[type=radio][value="clearBounds"]').change(function() {
        map.removeLayer(fResponseUnits);
        map.removeLayer(protectAreas);
        map.removeLayer(cntyBnds);
        $("#control").addClass("disabled");
    });
    $('input[type=radio][value="clearCov"]').change(function() {
        map.removeLayer(currentLandCover);
        $("#bio").addClass("disabled");
        $("#oveg").addClass("disabled");
        map.removeLayer(ogVeg);
        map.removeControl(opacitySlider);
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
    ogVeg = new L.geoJson(data, vegOptions);
    $('input[value="ogVeg"]').on('change', function() {
        var ogVegCheck = document.querySelector('input[value="ogVeg"]');
        if (ogVegCheck.checked){
            map.removeLayer(currentLandCover);
            ogVeg.addTo(map);
            $("#oveg").removeClass("disabled");
            sidebar.open('original')
        }
        if (!ogVegCheck.checked){
            map.removeLayer(ogVeg);
            $("#oveg").addClass("disabled");
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
    fResponseUnits = new L.geoJson(data, {
        style: function (feature) {
            return {
                weight: 1,
                opacity: .8,
                fillOpacity: 0,
                color: '#636363',
            }
        },
        onEachFeature: function(feature,layer){
            layer.on({
                mouseover:highlightFeature,
                mouseout:resetResponseStyle,
            })
        }
        
    });
    $('input[value="fResponse"]').on('change', function() {
        map.removeLayer(cntyBnds);
        map.removeLayer(protectAreas);
        var responseCheck = document.querySelector('input[value="fResponse"]');
        if (responseCheck.checked){
            fResponseUnits.addTo(map);
            fResponseUnits.bringToBack();
            $("#control").removeClass("disabled");
            sidebar.open('history')
        }
        if (!responseCheck.checked){
            map.removeLayer(fResponseUnits);
        }
    });
}

function resetResponseStyle (e) {
    var layer = e.target;
    fResponseUnits.resetStyle(e.target);
}

function fireProtect (data, map){
    var protectOptions = {
        weight: 1,
        opacity: .8,
        fillOpacity: 0,
        color: '#636363',
    }
    protectAreas = new L.geoJson(data, {
        style: function(feature){
            if (feature.properties.PROT_TYPE == 'EXTENSIVE'){
                return{
                    weight: 1,
                    opacity: .8,
                    fillOpacity: .5,
                    color: '#636363',
                    fillColor: '#fdc086', 
                }
            }
            if (feature.properties.PROT_TYPE == 'INTENSIVE'){
                return{
                    weight: 1,
                    opacity: .8,
                    fillOpacity: .5,
                    color: '#636363',
                    fillColor: '#beaed4', 
                }
            }
            if (feature.properties.PROT_TYPE == 'COOP'){
                return{
                    weight: 1,
                    opacity: .8,
                    fillOpacity: .5,
                    color: '#636363',
                    fillColor: '#7fc97f', 
                }
            }
        }
    });
    $('input[value="fProtect"]').on('change', function() {
        map.removeLayer(cntyBnds);
        map.removeLayer(fResponseUnits);
        var protCheck = document.querySelector('input[value="fProtect"]');
        if (protCheck.checked){
            protectAreas.addTo(map);
            protectAreas.bringToBack();
            $("#control").removeClass("disabled");
            sidebar.open('history')
        }
        if (!protCheck.checked){
            map.removeLayer(protectAreas);
        }
    });

}

function addFirePolys(data, map) {
    var firepolyOptions = {
        weight: 1.5,
        opacity: .8,
        fillOpacity: .8,
        fillColor: '#de2d26',
        color: '#99000d',
    }
    firePolys = new L.geoJson(data, {
        style: function(feature){
            return {
                weight: 1.5,
                opacity: .8,
                fillOpacity: .8,
                fillColor: '#de2d26',
                color: '#99000d',
            }
        },
        onEachFeature: function(feature,layer){
            layer.on({
                mouseover:highlightFeature,
                mouseout:resetStyle,
                click: zoomToFeat
            })
            layer.on({
                click: panelInfo,
            })

        }
    });
    firePolys.addTo(map);

    $('input[value="firepoly"]').on('change', function() {
        var cntyCheck = document.querySelector('input[value="firepoly"]');
        if (cntyCheck.checked){
            firePolys.addTo(map);
            firePoint.bringToFront();
            // map.addControl(opacitySlider);
            // opacitySlider.setOpacityLayer(firePolys);
        }
        if (!cntyCheck.checked){
            map.removeLayer(firePolys);
            map.removeControl(opacitySlider);
        }
    });


}

function panelInfo (e) {
    var layer = e.target;
    console.log(layer);
    $("#polyInfoSidebar").toggle();
    $("#closepannel").on('click', function(e) {

        $("#polyInfoSidebar").hide();

    });
}

function highlightFeature (e) {
    var layer = e.target;
    layer.setStyle({
        weight: 1.5,
        opacity: .8,
        fillOpacity: .8,
        color: '#525252',
        fillColor: '#737373'
    })
}
function resetStyle (e) {
    var layer = e.target;
    firePolys.resetStyle(e.target);
}

function zoomToFeat(e){
    map.fitBounds(e.target.getBounds());
    $("#plyInfo").show();
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
      content: '<div id="download" class="modal"><div class="modal-header"><h1>Download Layers</h1><fieldset id="fireCheck"><legend class="checkText2"><h4>Select layers for download: </h4> </legend><div><input type="checkbox" id="wibndsCheck" class="downCheck" name="feature"value="wiBnds" /><label for="wibndsCheck">Wisconsin County Boundaries (GeoJSON)</label></div><div><input type="checkbox" id="responseDownload" class="downCheck" name="feature"value="response" /><label for="responseDownload">Fire Response Units (GeoJSON)</label></div><div><input type="checkbox" id="protectDownload" class="downCheck" name="feature"value="protect" /><label for="protectDownload">Fire Protection Areas (GeoJSON)</label></div><div><input type="checkbox" id="vegDownload" class="downCheck" name="feature"value="veg" /><label for="vegDownload">Wisconsin Pre-settlement Vegetation (GeoJSON)</label></div><div><input type="checkbox" id="coverDownload" class="downCheck" name="feature"value="cover" /><label for="coverDownload">Current Wisconsin Land Cover (TIFF)</label></div><div><input type="checkbox" id="pointDownload" class="downCheck" name="feature"value="pointDownload" /><label for="pointDownload">Fires Greater than 100 acres 1981-Present (GeoJSON)</label></div><div><input type="checkbox" id="polyDownload" class="downCheck" name="feature"value="poly" /><label for="polyDownload">Historic Fire Polygons (GeoJSON)</label></div></fieldset><button id="dwnload">Download</button></div></div>'
    });
    $("#dwnload").on('click',function(e){
        $("#allCheck").click(function(){
            $("#wibndsCheck").attr('checked', 'checked');
        });
        var cntyCheck = document.querySelector('input[value="wiBnds"]');
        if (cntyCheck.checked){
            // var zip = new jsZip();
            // jsZipUtils.getBinaryContent('data/WI_bnds.json', function(err, data){
            //     if (err){
            //         console.log(err);
            //     }
            //     zip.file('WI_bnds.json', data);
            // })
            saveAs('data/WI_bnds.json', 'WI_bnds.json');
        }
        // setTimeout(function(){
        //     zip.generateAsync({type:"blob"}).then(function(content){
        //         saveAs(content, "fire.zip")
        //     })
        // }, 2000);
        // window.alert("This button works!")

        var response = document.querySelector('input[value="response"]');
        if(response.checked){
            saveAs('data/fire_response.geojson', 'fire_response.geojson');
        }
        var protect = document.querySelector('input[value="protect"]');
        if(protect.checked){
            saveAs('data/protection_areas.geojson', 'protection_areas.geojson');
        }
        var veg = document.querySelector('input[value="veg"]');
        if(veg.checked){
            saveAs('data/og_veg_poly.geojson', 'presettlement_veg.geojson');
        }
        // var cover = document.querySelector('input[value="cover"]');
        // if(cover.checked){
        //     saveAs('data/cover.tiff', 'current_land_cover.tiff');
        // }
        var points = document.querySelector('input[value="point"]');
        if(points.checked){
            saveAs('data/fires_100_final.geojson', 'fires_100_acres.geojson');
        }
        var poly = document.querySelector('input[value="poly"]');
        if(poly.checked){
            saveAs('data/historic_fires_polys.geojson', 'historic_fires_polys.geojson');
        }
    });
  });

$(document).ready(createMap);

$(window).on('load', function(){
    map.fire('modal', {
      content: '<div id="start" class="modal""><div class="modal-header"><h1 style="text-align: center">Wisconsin on Fire</h1><h2 style="text-align: center">An exploratory history of wildfire in Wisconsin</h2></div></div>'
    });
});
