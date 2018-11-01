function createMap(){
    //create the map and zooms it in to the US
    // var map = L.map('mapid').setView([39.82, -98.58], 3);
    var map = L.map('mapid', {
    center: [39.82, -98.58],
    zoom: 3,
    minZoom: 3,
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

};

function sidebar(mymap) {
    var sidebar = L.control.sidebar({
        autopan: true,       // whether to maintain the centered map point when opening the sidebar
        closeButton: false,    // whether t add a close button to the panes
        container: 'sidebar', // the DOM container or #ID of a predefined sidebar container that should be used
        position: 'left',     // left or right
    }).addTo(mymap);  
}

$(document).ready(createMap);