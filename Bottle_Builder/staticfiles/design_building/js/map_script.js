// ------------------------------------------------------------------------------------------------------



// Map Stuff
L.mapbox.accessToken = 'pk.eyJ1IjoiZnVlcnRlbnVldmFjYXNhIiwiYSI6ImNqMGgzdTg5ZzAydnEyd3J1cHF4eG54eHUifQ.Aikx4qEIowhrKbSVhNEpRw';
//mapboxgl.accessToken = 'pk.eyJ1IjoiZnVlcnRlbnVldmFjYXNhIiwiYSI6ImNqMGgzdTg5ZzAydnEyd3J1cHF4eG54eHUifQ.Aikx4qEIowhrKbSVhNEpRw';

var map = L.mapbox.map('map_to_draw_building', 'mapbox.streets-satellite')
    .setView([38.89399, -77.03659], 19);
/*var map = new mapboxgl.Map({
    container:'map_to_draw_building',
    style:'mapbox://styles/mapbox/satellite-streets-v9',
    center: [ -73.993605, 40.750438],
    zoom:14
});*/


//L.Control.geocoder().addTo(map);

var featureGroup = L.featureGroup().addTo(map);

var drawControl = new L.Control.Draw({

  draw: {
    polygon: true,
    polyline: false,
    rectangle: false,
    circle: false,
    marker: false
  }
}).addTo(map);

/*var draw = new MapboxDraw({
    displayControlsDefault: false,
    controls:{
        polygon: true,
        trash: true
    }
});

map.addControl(draw);*/

// call buildingFloorDrawn when the building perimeter is drawn
map.on('draw:created', buildingFloorDrawn);

// ------------------------------------------------------------------------------------------------------




// ------------------------------------------------------------------------------------------------------
// fires when a polygon is done being drawn on the map.
// It stores the information of the vertices of this polygon as the
// corners of the building. It updates the building_info global array
// with the area of the building floor and the array containing data about the walls.
function buildingFloorDrawn(e) {
    // clear map
    alert("hey");
    featureGroup.clearLayers();
    featureGroup.addLayer(e.layer);


    var area_of_building_floor_meters_sq = (LGeo.area(e.layer) ).toFixed(2) ;
    var area_of_building_floor_feet_sq = (area_of_building_floor_meters_sq*10.7639).toFixed(2);

    building_info["area_meters_sq"] = area_of_building_floor_meters_sq;
    building_info["area_feet_sq"] = area_of_building_floor_feet_sq;

    var coordinate_set_vertices = e.layer._latlngs[0];

    building_info["walls"] = convert_coordinates_to_walls(coordinate_set_vertices);


}
// ------------------------------------------------------------------------------------------
