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
var sidebar;
var acres = [];
var legendControl;
var legCount = 0;
var json = [{}];
var legend;
var opacitySlider = new L.Control.opacitySlider();
dragElement(document.getElementById(("polyInfoSidebar")));
$(".legend-control-container.leaflet-control").hide();
$("#sequenceControls").hide();
$("#sliderInfo").hide();
$("#ogVegLegend").hide();
$("#ogVegLegend").append("<img src='img/vegleg.PNG'></img>");


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
    // getData6(map);
    getData(map);
    getData7(map);
    getLandCov(map);
    addPreVeg(map);
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
            $("#oveg").addClass("disabled");
            $("#bio").removeClass("disabled");
            $("#ogVegLegend").hide();
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




    firePoint = L.geoJson(data, {
        pointToLayer: function(feature, latlng){

            if(feature.properties.Date != null){
                if(Number(feature.properties.Date.substring(0,4)) > 1850 && Number(feature.properties.Date.substring(0,4)) < 1910){
                    fires_100 = L.circleMarker(latlng, geojsonMarkerOptions)
                    var fAcres = feature.properties.ACRES;
                    var fDate = feature.properties.Date;
                    var pointFeature = feature.properties
                    json.push(pointFeature);
                    zoom = map.getZoom();
                    acres.push(fAcres);
                    fires_100.setRadius(Math.pow(fAcres, .4)/2);
                    zoom = map.getZoom();

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
            }

        }
    });
    createSequenceControls(map,data);
    $('#sliderInfo').html('Fires Greater than 100 acres 1874-1909');


    $('input[value="fire100"]').on('change', function() {
        var cntyCheck = document.querySelector('input[value="fire100"]');
        if (cntyCheck.checked){
            map.removeLayer(firePolys);
            firePoint.addTo(map);
            $(".legend-control-container.leaflet-control").show();
            $("#sequenceControls").show();
            $("#sliderInfo").show();
            createLeg(map);
        }
        if (!cntyCheck.checked){
            $(".legend-control-container.leaflet-control").hide();
            map.removeLayer(firePoint);
            firePolys.addTo(map);
            $("#sequenceControls").hide();
            $("#sliderInfo").hide();
        }
    });
}

function pointChange (point) {
}


function addState (data, map){
    var stateOptions = {
        weight: 2,
        opacity: .8,
        fillOpacity: .2,
        color: '#252525',
    }
    var wiBounds = L.geoJson(data, stateOptions);
    wiBounds.addTo(map);

}

function removeBoundaries (map){
    $('input[type=radio][value="clearBounds"]').change(function() {
        map.removeLayer(fResponseUnits);
        // map.removeLayer(protectAreas);
        map.removeLayer(cntyBnds);
        $("#suppression").addClass("disabled");
    });
    $('input[type=radio][value="clearCov"]').change(function() {
        if (map.hasLayer(currentLandCover)){
            map.removeLayer(currentLandCover);
        }
        if (map.hasLayer(ogVeg)){
            map.removeLayer(ogVeg);
            $("#ogVegLegend").hide();
        }
        $("#bio").addClass("disabled");
        $("#oveg").addClass("disabled");
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
    cntyBnds = new L.geoJson(data, {
        style: function(feature){
            return {
                weight: 1,
                opacity: .8,
                fillOpacity: 0,
                color: '#636363',
            }
        },
        onEachFeature: function(feature,layer){
            layer.on({
                mouseover:highlightCounty,
                mouseout:resetCounty,
            })
            var name = feature.properties.COUNTY_NAM;
            layer.bindPopup(name + " County");
            layer.on('mouseover', function (e) {
                this.openPopup();
            });
            layer.on('mouseout', function (e) {
                this.closePopup();
            });
        }
    });

    $('input[type=radio][value="cntyBnds"]').change(function() {
        map.removeLayer(fResponseUnits);
        // map.removeLayer(protectAreas);
        var cntyCheck = document.querySelector('input[value="cntyBnds"]');
        if (cntyCheck.checked){
            cntyBnds.addTo(map);
            if (map.hasLayer(firePoint)){
                firePoint.bringToFront();
            }
            if (map.hasLayer(firePolys)){
                firePolys.bringToFront();
            }
            // cntyBnds.bringToBack();
        }
        if (!cntyCheck.checked){
            map.removeLayer(cntyBnds);
        }
    });

}
function highlightCounty (e) {
    var layer = e.target;
    layer.setStyle({
        weight: 1.5,
        opacity: .8,
        fillOpacity: .8,
        color: '#525252',
        fillColor: '#737373'
    })
}
function resetCounty (e) {
    cntyBnds.resetStyle(e.target);
}

function addPreVeg (map){

    ogVeg = L.tileLayer('tiles/original_veg/{z}/{x}/{y}.png', {});
    $('input[value="ogVeg"]').on('change', function() {
        var ogVegCheck = document.querySelector('input[value="ogVeg"]');
        if (ogVegCheck.checked){
            if (map.hasLayer(currentLandCover)){
                map.removeLayer(currentLandCover);
            }
            ogVeg.addTo(map).bringToFront();
            map.addControl(opacitySlider);
            opacitySlider.setOpacityLayer(ogVeg);
            $("#bio").addClass("disabled")
            $("#oveg").removeClass("disabled");
            $("#ogVegLegend").show();

        }
        if (!ogVegCheck.checked){
            map.removeLayer(ogVeg);
            $("#oveg").addClass("disabled");
            $("#ogVegLegend").hide();

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
            if (feature.properties.PROT_TYPE == 'EXTENSIVE'){
                return{
                    weight: 1,
                    opacity: .8,
                    fillOpacity: .3,
                    color: '#636363',
                    fillColor: '#fdc086',
                }
            }
            if (feature.properties.PROT_TYPE == 'INTENSIVE'){
                return{
                    weight: 1,
                    opacity: .8,
                    fillOpacity: .3,
                    color: '#636363',
                    fillColor: '#beaed4',
                }
            }
            if (feature.properties.PROT_TYPE == 'COOP'){
                return{
                    weight: 1,
                    opacity: .8,
                    fillOpacity: .3,
                    color: '#636363',
                    fillColor: '#7fc97f',
                }
            }

        },
        onEachFeature: function(feature,layer){
            layer.on({
                mouseover:highlightFeature,
                mouseout:resetResponseStyle,
            })
            var name = feature.properties.FRU_NAME;
            var group = feature.properties.DIS_GROUP;
            var type = feature.properties.PROT_TYPE;
            layer.bindPopup("<b>Name: </b>" + feature.properties.FRU_NAME + "<br><b>Group: </b>" + feature.properties.DIS_GROUP + "<br><b>Type: </b>" + feature.properties.PROT_TYPE);
        }

    });
    $('input[value="fResponse"]').on('change', function() {
        map.removeLayer(cntyBnds);
        // map.removeLayer(protectAreas);
        var responseCheck = document.querySelector('input[value="fResponse"]');
        if (responseCheck.checked){
            fResponseUnits.addTo(map);
            $("#suppression").removeClass("disabled");
            fResponseUnits.bringToFront();
            firePolys.bringToFront();
            pointFire.bringToFront();

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
            if(map.hasLayer(firePoint)){
                map.removeLayer(firePoint);
            }
            $(".legend-control-container.leaflet-control").hide();
            $("#sequenceControls").hide();
            $("#sliderInfo").hide();
            // map.addControl(opacitySlider);
            // opacitySlider.setOpacityLayer(firePolys);
        }
        if (!cntyCheck.checked){
            $(".legend-control-container.leaflet-control").show();
            $("#sequenceControls").show();
            $("#sliderInfo").show();
            map.removeLayer(firePolys);
            map.removeControl(opacitySlider);
            firePoint.addTo(map);
        }
    });
}

function panelInfo (e) {
    var layer = e.target;
    var name = layer.feature.properties.NAME
    var p1 = layer.feature.properties.blurb1
    var p2 = layer.feature.properties.blurb2
    var img1 = layer.feature.properties.pic1
    var img2 = layer.feature.properties.pic2
    if (p2 != "" && img2 != "") {
        $("#polyInfoSidebar").html (
                '<div class="sidebar-container"><span style="font-size: 15px;font-weight: bold;">' + name
                 + '</span><a href="#" id="closepannel"><i class="fa fa-times closep" style=""></i></a>'
                 + '<p class="text">' + p1 + '</p><img src="img/' + img1 + '" style="width: 100%">'
                 + '<p class="text">' + p2 + '</p><img src="img/' + img2 + '" style="width: 100%"></div>'
        )
    }
    if (img1 == "" && img2 == "") {
        $("#polyInfoSidebar").html (
                '<div class="sidebar-container"><span style="font-size: 15px;font-weight: bold;">' + name
                 + '</span><a href="#" id="closepannel"><i class="fa fa-times closep" style=""></i></a>'
                 + '<p class="text">' + p1 + '</p>'
                 + '<p class="text">' + p2 + '</p></div>'
        )
    }
    if (img1 != "" && img2 == "") {
        $("#polyInfoSidebar").html (
                '<div class="sidebar-container"><span style="font-size: 15px;font-weight: bold;">' + name
                 + '</span><a href="#" id="closepannel"><i class="fa fa-times closep" style=""></i></a>'
                 + '<p class="text">' + p1 + '</p><img src="img/' + img1 + '" style="width: 100%">'
                 + '<p class="text">' + p2 + '</p></div>'
        )
    }
    $("#polyInfoSidebar").toggle();
    if($("#polyInfoSidebar").is(":hidden")) {
        firePolys.addTo(map);
    };
    console.log(layer);
    sidebar.close();
    $("#closepannel").on('click', function(e) {
        $("#polyInfoSidebar").hide();
        firePolys.addTo(map);
        firePoint.bringToFront();

        sidebar.open('home');

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
    map.removeLayer(firePolys);
    e.target.addTo(map);
    map.fitBounds(e.target.getBounds());
    firePoint.bringToFront();
    $("#plyInfo").show();

}

function createLeg (map) {
    legendControl = L.Control.extend({
        options: {
            position: 'bottomright'
        },

        onAdd: function (map) {
            var container = L.DomUtil.create('div', 'legend-control-container');

            $(container).append('<div id="pointLegend"</div>');
            var svg = '<svg id="attribute-legend" width="320px" height="200" >';
            var circles = {
                min: 20,
                mean: 40,
                max: 60

            }

            for (var circle in circles) {
                svg += '<circle class="legend-circle" id="' + circle + '" fill="#8856a7" fill-opacity="0.8" stroke="black" cx="150"/>';

                if (circle == 'min' || circle =='max'){
                    svg += '<text id="' + circle + '-text" x="193" y="' + (circles[circle]+11) + '"></text>';
                }

            }
            svg += '<text id="title-text" x="193" y="' + (circles[circle]+11) + '">Fire Size (Acres)</text>';
            svg += "</svg>";
            $(container).append(svg);
            return container;
        }

    });
    legend = new legendControl();

    if (legCount == 0){
        map.addControl(legend);
    }


    legCount+=1;

    updateLeg(map);

}

function updateLeg (map) {
    // var content = "<b>Fire Size (Acres)</b>";
    // $("#pointLegend").html(content);
    var min = 10000,
        max = -1000;

    for (var i =0; i<acres.length; i++) {
        var attribute = acres[i];
        if (attribute < min){
            min = attribute;
        }
        if (attribute > max){
            max = attribute;
        }
    }

    //set mean
    var mean = (max + min) / 2;
    //Step 3: assign the cy and r attributes

    var circleValues = {
        max: min,
        mean: mean,
        min: max
    }

    for (var key in circleValues){
        var radius = calcRadius(circleValues[key]);
        var radiusText = calcRadius(circleValues['min']);
        $('#'+key).attr({
            cy: (80-radius)+120,
            r: radius
        });
        //Step 4: add legend text
        if (key == 'min' ){
            $('#'+key+'-text').text(Math.round(circleValues[key]));
            $('#'+key+'-text').attr({
                x:193 + (radiusText)/2,
                y: ((80-radius)+120)-(radius*.7),
            })
            $('#'+key+'-text').css("font-weight","Bold");
        }
        if (key =='max'){
            $('#'+key+'-text').text(Math.round(circleValues[key]));
            $('#'+key+'-text').attr({
                x:193 + (radiusText)/2,
                y: ((80-radius)+120),
            })
            $('#'+key+'-text').css("font-weight","Bold");
        }

    }
    $("#title-text").css("font-weight","Bold");
    $("#title-text").attr({
        x: 95,
        y: ((80-radius)+110)-(radiusText),
    })

}

function createSequenceControls (map, data){
    $('#sequenceControls').append('<button class="skip" id="reverse" </button>');
    $('#sequenceControls').append('<input class="range-slider" type="range">');

     //set slider attributes
    $('.range-slider').attr({
        max: 8,
        min: 0,
        value: 0,
        step: 1
    });

    //appends button to div
    $('#sequenceControls').append('<button class="skip" id="forward" </button>');

    //appends icons to buttons
    $('#reverse').html('<i class="fa fa-caret-left"></i>');
    $('#forward').html('<i class="fa fa-caret-right"></i>');
    $('.skip').click(function(){
        //get the old index value
        var index = $('.range-slider').val();

        //Step 6: increment or decrement depending on button clicked
        if ($(this).attr('id') == 'forward'){
            index++;
            //Step 7: if past the last attribute, wrap around to first attribute
            index = index > (8) ? 0 : index;
        } else if ($(this).attr('id') == 'reverse'){
            index--;
            //Step 7: if past the first attribute, wrap around to last attribute
            index = index < 0 ? (8) : index;

        };

        //Step 8: update slider
        $('.range-slider').val(index);

        map.eachLayer(function (layer) {
            if(layer.feature && layer.feature.geometry){
                if(layer.feature.geometry.type == "Point"){
                    map.removeLayer(layer);
                }
            }
        });

        var geojsonMarkerOptions = {
            fillColor: "#8856a7",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };

        acres=[];


        if(index==0){
            firePoint = L.geoJson(data, {
                pointToLayer: function(feature, latlng){
                    if (feature.properties.Date != null) {
                        var fireDate = Number(feature.properties.Date.substring(0,4));
                        if(fireDate > 1850 && fireDate < 1910){
                            fires_100 = L.circleMarker(latlng, geojsonMarkerOptions)
                            var fAcres = feature.properties.ACRES;
                            var fDate = feature.properties.Date;
                            var pointFeature = feature.properties
                            zoom = map.getZoom();
                            acres.push(fAcres);
                            fires_100.setRadius(Math.pow(fAcres, .4)/2);
                            zoom = map.getZoom();

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
                    }
                }
            }).addTo(map);
            updateLeg(map);
            $('#sliderInfo').html('Fires Greater than 100 acres 1850-1909');
        }
        if(index==1){
            firePoint = L.geoJson(data, {
                pointToLayer: function(feature, latlng){
                    if (feature.properties.Date != null) {
                        var fireDate = Number(feature.properties.Date.substring(0,4));
                        if(fireDate >= 1915 && fireDate < 1940){
                            fires_100 = L.circleMarker(latlng, geojsonMarkerOptions)
                            var fAcres = feature.properties.ACRES;
                            var fDate = feature.properties.Date;
                            var pointFeature = feature.properties
                            zoom = map.getZoom();
                            acres.push(fAcres);
                            fires_100.setRadius(Math.pow(fAcres, .4)/2);
                            zoom = map.getZoom();

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
                    }


                }
            }).addTo(map);
            updateLeg(map);
            $('#sliderInfo').html('Fires Greater than 100 acres 1915-1939');
        }
        if(index==2){
            firePoint = L.geoJson(data, {
                pointToLayer: function(feature, latlng){
                    if (feature.properties.Date != null) {
                        var fireDate = Number(feature.properties.Date.substring(0,4));
                        if(fireDate >= 1940 && fireDate < 1960){
                            fires_100 = L.circleMarker(latlng, geojsonMarkerOptions)
                            var fAcres = feature.properties.ACRES;
                            var fDate = feature.properties.Date;
                            var pointFeature = feature.properties
                            zoom = map.getZoom();
                            acres.push(fAcres);
                            fires_100.setRadius(Math.pow(fAcres, .4)/2);
                            zoom = map.getZoom();

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
                    }
                }
            }).addTo(map);
            updateLeg(map);
            $('#sliderInfo').html('Fires Greater than 100 acres 1940-1959');

        }
        if(index==3){
            firePoint = L.geoJson(data, {
                pointToLayer: function(feature, latlng){
                    if (feature.properties.Date != null) {
                        var fireDate = Number(feature.properties.Date.substring(0,4));
                        if(fireDate > 1960 && fireDate < 1969){
                            fires_100 = L.circleMarker(latlng, geojsonMarkerOptions)
                            var fAcres = feature.properties.ACRES;
                            var fDate = feature.properties.Date;
                            var pointFeature = feature.properties
                            zoom = map.getZoom();
                            acres.push(fAcres);
                            fires_100.setRadius(Math.pow(fAcres, .4)/2);
                            zoom = map.getZoom();

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
                    }
                }
            }).addTo(map);
            updateLeg(map);
            $('#sliderInfo').html('Fires Greater than 100 acres 1960-1969');

        }
        if(index==4){
            firePoint = L.geoJson(data, {
                pointToLayer: function(feature, latlng){
                    if (feature.properties.Date != null) {
                        var fireDate = Number(feature.properties.Date.substring(0,4));
                        if(fireDate > 1970 && fireDate < 1979){
                            fires_100 = L.circleMarker(latlng, geojsonMarkerOptions)
                            var fAcres = feature.properties.ACRES;
                            var fDate = feature.properties.Date;
                            var pointFeature = feature.properties
                            zoom = map.getZoom();
                            acres.push(fAcres);
                            fires_100.setRadius(Math.pow(fAcres, .4)/2);
                            zoom = map.getZoom();

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
                    }
                }
            }).addTo(map);
            updateLeg(map);
            $('#sliderInfo').html('Fires Greater than 100 acres 1970-1979');

        }
        if(index==5){
            firePoint = L.geoJson(data, {
                pointToLayer: function(feature, latlng){
                    if (feature.properties.Date != null) {
                        var fireDate = Number(feature.properties.Date.substring(0,4));
                        if(fireDate > 1980 && fireDate < 1989){
                            fires_100 = L.circleMarker(latlng, geojsonMarkerOptions)
                            var fAcres = feature.properties.ACRES;
                            var fDate = feature.properties.Date;
                            var pointFeature = feature.properties
                            zoom = map.getZoom();
                            acres.push(fAcres);
                            fires_100.setRadius(Math.pow(fAcres, .4)/2);
                            zoom = map.getZoom();

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
                    }
                }
            }).addTo(map);
            updateLeg(map);
            $('#sliderInfo').html('Fires Greater than 100 acres 1980-1989');

        }
        if(index==6){
            firePoint = L.geoJson(data, {
                pointToLayer: function(feature, latlng){
                    if (feature.properties.Date != null) {
                        var fireDate = Number(feature.properties.Date.substring(0,4));
                        if(fireDate > 1990 && fireDate < 1999){
                            fires_100 = L.circleMarker(latlng, geojsonMarkerOptions)
                            var fAcres = feature.properties.ACRES;
                            var fDate = feature.properties.Date;
                            var pointFeature = feature.properties
                            zoom = map.getZoom();
                            acres.push(fAcres);
                            fires_100.setRadius(Math.pow(fAcres, .4)/2);
                            zoom = map.getZoom();

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
                    }
                }
            }).addTo(map);
            updateLeg(map);
            $('#sliderInfo').html('Fires Greater than 100 acres 1990-1999');

        }
        if(index==7){
            firePoint = L.geoJson(data, {
                pointToLayer: function(feature, latlng){
                    if (feature.properties.Date != null) {
                        var fireDate = Number(feature.properties.Date.substring(0,4));
                        if(fireDate > 2000 && fireDate < 2009){
                            fires_100 = L.circleMarker(latlng, geojsonMarkerOptions)
                            var fAcres = feature.properties.ACRES;
                            var fDate = feature.properties.Date;
                            var pointFeature = feature.properties
                            zoom = map.getZoom();
                            acres.push(fAcres);
                            fires_100.setRadius(Math.pow(fAcres, .4)/2);
                            zoom = map.getZoom();

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
                    }
                }
            }).addTo(map);
            updateLeg(map);
            $('#sliderInfo').html('Fires Greater than 100 acres 2000-2009');

        }
        if(index==8){
            firePoint = L.geoJson(data, {
                pointToLayer: function(feature, latlng){
                    if (feature.properties.Date != null) {
                        var fireDate = Number(feature.properties.Date.substring(0,4));
                        if(fireDate > 2010 && fireDate < 2020){
                            fires_100 = L.circleMarker(latlng, geojsonMarkerOptions)
                            var fAcres = feature.properties.ACRES;
                            var fDate = feature.properties.Date;
                            var pointFeature = feature.properties
                            zoom = map.getZoom();
                            acres.push(fAcres);
                            fires_100.setRadius(Math.pow(fAcres, .4)/2);
                            zoom = map.getZoom();

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
                    }
                }
            }).addTo(map);
            updateLeg(map);
            $('#sliderInfo').html('Fires Greater than 100 acres 2010-2020');
        }
    });
    // Step 5: input listener for slider
    $('.range-slider').on('input', function(){
        //Step 6: get the new index value
        var index = $(this).val();

        //get the old index value
        var index = $('.range-slider').val();

        //Step 6: increment or decrement depending on button clicked
        if ($(this).attr('id') == 'forward'){
            index++;
            //Step 7: if past the last attribute, wrap around to first attribute
            index = index > (9) ? 0 : index;
        } else if ($(this).attr('id') == 'reverse'){
            index--;
            //Step 7: if past the first attribute, wrap around to last attribute
            index = index < 0 ? (9) : index;

        };

        //Step 8: update slider
        $('.range-slider').val(index);

        map.eachLayer(function (layer) {
            if(layer.feature && layer.feature.geometry){
                if(layer.feature.geometry.type == "Point"){
                    map.removeLayer(layer);
                }
            }
        });

        var geojsonMarkerOptions = {
            fillColor: "#8856a7",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };

        acres=[];

        if(index==0){
            firePoint = L.geoJson(data, {
                pointToLayer: function(feature, latlng){
                    if (feature.properties.Date != null) {
                        var fireDate = Number(feature.properties.Date.substring(0,4));
                        if(fireDate > 1850 && fireDate < 1910){
                            fires_100 = L.circleMarker(latlng, geojsonMarkerOptions)
                            var fAcres = feature.properties.ACRES;
                            var fDate = feature.properties.Date;
                            var pointFeature = feature.properties
                            zoom = map.getZoom();
                            acres.push(fAcres);
                            fires_100.setRadius(Math.pow(fAcres, .4)/2);
                            zoom = map.getZoom();

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
                    }
                }
            }).addTo(map);
            updateLeg(map);
            $('#sliderInfo').html('Fires Greater than 100 acres 1850-1909');
        }
        if(index==1){
            firePoint = L.geoJson(data, {
                pointToLayer: function(feature, latlng){
                    if (feature.properties.Date != null) {
                        var fireDate = Number(feature.properties.Date.substring(0,4));
                        if(fireDate >= 1915 && fireDate < 1940){
                            fires_100 = L.circleMarker(latlng, geojsonMarkerOptions)
                            var fAcres = feature.properties.ACRES;
                            var fDate = feature.properties.Date;
                            var pointFeature = feature.properties
                            zoom = map.getZoom();
                            acres.push(fAcres);
                            fires_100.setRadius(Math.pow(fAcres, .4)/2);
                            zoom = map.getZoom();

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
                    }


                }
            }).addTo(map);
            updateLeg(map);
            $('#sliderInfo').html('Fires Greater than 100 acres 1915-1939');
        }
        if(index==2){
            firePoint = L.geoJson(data, {
                pointToLayer: function(feature, latlng){
                    if (feature.properties.Date != null) {
                        var fireDate = Number(feature.properties.Date.substring(0,4));
                        if(fireDate >= 1940 && fireDate < 1960){
                            fires_100 = L.circleMarker(latlng, geojsonMarkerOptions)
                            var fAcres = feature.properties.ACRES;
                            var fDate = feature.properties.Date;
                            var pointFeature = feature.properties
                            zoom = map.getZoom();
                            acres.push(fAcres);
                            fires_100.setRadius(Math.pow(fAcres, .4)/2);
                            zoom = map.getZoom();

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
                    }
                }
            }).addTo(map);
            updateLeg(map);
            $('#sliderInfo').html('Fires Greater than 100 acres 1940-1959');

        }
        if(index==3){
            firePoint = L.geoJson(data, {
                pointToLayer: function(feature, latlng){
                    if (feature.properties.Date != null) {
                        var fireDate = Number(feature.properties.Date.substring(0,4));
                        if(fireDate > 1960 && fireDate < 1969){
                            fires_100 = L.circleMarker(latlng, geojsonMarkerOptions)
                            var fAcres = feature.properties.ACRES;
                            var fDate = feature.properties.Date;
                            var pointFeature = feature.properties
                            zoom = map.getZoom();
                            acres.push(fAcres);
                            fires_100.setRadius(Math.pow(fAcres, .4)/2);
                            zoom = map.getZoom();

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
                    }
                }
            }).addTo(map);
            updateLeg(map);
            $('#sliderInfo').html('Fires Greater than 100 acres 1960-1969');

        }
        if(index==4){
            firePoint = L.geoJson(data, {
                pointToLayer: function(feature, latlng){
                    if (feature.properties.Date != null) {
                        var fireDate = Number(feature.properties.Date.substring(0,4));
                        if(fireDate > 1970 && fireDate < 1979){
                            fires_100 = L.circleMarker(latlng, geojsonMarkerOptions)
                            var fAcres = feature.properties.ACRES;
                            var fDate = feature.properties.Date;
                            var pointFeature = feature.properties
                            zoom = map.getZoom();
                            acres.push(fAcres);
                            fires_100.setRadius(Math.pow(fAcres, .4)/2);
                            zoom = map.getZoom();

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
                    }
                }
            }).addTo(map);
            updateLeg(map);
            $('#sliderInfo').html('Fires Greater than 100 acres 1970-1979');

        }
        if(index==5){
            firePoint = L.geoJson(data, {
                pointToLayer: function(feature, latlng){
                    if (feature.properties.Date != null) {
                        var fireDate = Number(feature.properties.Date.substring(0,4));
                        if(fireDate > 1980 && fireDate < 1989){
                            fires_100 = L.circleMarker(latlng, geojsonMarkerOptions)
                            var fAcres = feature.properties.ACRES;
                            var fDate = feature.properties.Date;
                            var pointFeature = feature.properties
                            zoom = map.getZoom();
                            acres.push(fAcres);
                            fires_100.setRadius(Math.pow(fAcres, .4)/2);
                            zoom = map.getZoom();

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
                    }
                }
            }).addTo(map);
            updateLeg(map);
            $('#sliderInfo').html('Fires Greater than 100 acres 1980-1989');

        }
        if(index==6){
            firePoint = L.geoJson(data, {
                pointToLayer: function(feature, latlng){
                    if (feature.properties.Date != null) {
                        var fireDate = Number(feature.properties.Date.substring(0,4));
                        if(fireDate > 1990 && fireDate < 1999){
                            fires_100 = L.circleMarker(latlng, geojsonMarkerOptions)
                            var fAcres = feature.properties.ACRES;
                            var fDate = feature.properties.Date;
                            var pointFeature = feature.properties
                            zoom = map.getZoom();
                            acres.push(fAcres);
                            fires_100.setRadius(Math.pow(fAcres, .4)/2);
                            zoom = map.getZoom();

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
                    }
                }
            }).addTo(map);
            updateLeg(map);
            $('#sliderInfo').html('Fires Greater than 100 acres 1990-1999');

        }
        if(index==7){
            firePoint = L.geoJson(data, {
                pointToLayer: function(feature, latlng){
                    if (feature.properties.Date != null) {
                        var fireDate = Number(feature.properties.Date.substring(0,4));
                        if(fireDate > 2000 && fireDate < 2009){
                            fires_100 = L.circleMarker(latlng, geojsonMarkerOptions)
                            var fAcres = feature.properties.ACRES;
                            var fDate = feature.properties.Date;
                            var pointFeature = feature.properties
                            zoom = map.getZoom();
                            acres.push(fAcres);
                            fires_100.setRadius(Math.pow(fAcres, .4)/2);
                            zoom = map.getZoom();

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
                    }
                }
            }).addTo(map);
            updateLeg(map);
            $('#sliderInfo').html('Fires Greater than 100 acres 2000-2009');

        }
        if(index==8){
            firePoint = L.geoJson(data, {
                pointToLayer: function(feature, latlng){
                    if (feature.properties.Date != null) {
                        var fireDate = Number(feature.properties.Date.substring(0,4));
                        if(fireDate > 2010 && fireDate < 2020){
                            fires_100 = L.circleMarker(latlng, geojsonMarkerOptions)
                            var fAcres = feature.properties.ACRES;
                            var fDate = feature.properties.Date;
                            var pointFeature = feature.properties
                            zoom = map.getZoom();
                            acres.push(fAcres);
                            fires_100.setRadius(Math.pow(fAcres, .4)/2);
                            zoom = map.getZoom();

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
                    }
                }
            }).addTo(map);
            updateLeg(map);
            $('#sliderInfo').html('Fires Greater than 100 acres 2010-2020');
        }

    });

}



function calcRadius (attribute){

    var radius = Math.pow(attribute, .4)/2;
    return radius;


}

function getData(map){
    $.ajax("data/fires_final.geojson", {
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
    $.ajax("data/county_bounds.geojson", {
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
// function getData6(map){
//     $.ajax("data/protection_areas.geojson", {
//         dataType: "json",
//         success: function(response){
//             fireProtect(response, map);
//         }
//     })
// }
function getData7(map){
    $.ajax("data/fires_with_info.geojson", {
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
      content: '<div id="download" class="modal"><div class="modal-header"><h1>Download Layers</h1><fieldset id="fireCheck"><legend class="checkText2"><h4>Select layers for download: </h4> </legend><div><input type="checkbox" id="wibndsCheck" class="downCheck" name="feature"value="wiBnds" /><label for="wibndsCheck">Wisconsin County Boundaries (GeoJSON)</label></div><div><input type="checkbox" id="responseDownload" class="downCheck" name="feature"value="response" /><label for="responseDownload">Fire Response Units (GeoJSON)</label></div><div><input type="checkbox" id="vegDownload" class="downCheck" name="feature"value="veg" /><label for="vegDownload">Wisconsin Pre-settlement Vegetation (GeoJSON)</label></div><div><input type="checkbox" id="coverDownload" class="downCheck" name="feature"value="cover" /><label for="coverDownload">Current Wisconsin Land Cover (TIFF)</label></div><div><input type="checkbox" id="pointDownload" class="downCheck" name="feature"value="pointDownload" /><label for="pointDownload">Fires Greater than 100 acres 1981-Present (GeoJSON)</label></div><div><input type="checkbox" id="polyDownload" class="downCheck" name="feature"value="poly" /><label for="polyDownload">Historic Fire Polygons (GeoJSON)</label></div></fieldset><button id="dwnload">Download</button></div></div>'
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
            saveAs('data/fires_final.geojson', 'fires_100_acres.geojson');
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
