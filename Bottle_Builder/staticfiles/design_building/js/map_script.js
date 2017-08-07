
$(document).ready(function(){



    // ------------------------------------------------------------------------------------------------------

    mapboxgl.accessToken = 'pk.eyJ1IjoiZnVlcnRlbnVldmFjYXNhIiwiYSI6ImNqMGgzdTg5ZzAydnEyd3J1cHF4eG54eHUifQ.Aikx4qEIowhrKbSVhNEpRw';


    var map = new mapboxgl.Map({
        container: 'map_to_draw_building',
        style: 'mapbox://styles/mapbox/satellite-v9',
        center: [-91.874, 42.760], // longitude, latitude
        zoom: 1,
    });

    // add search
    map.addControl(new MapboxGeocoder({
        accessToken: mapboxgl.accessToken
    }));


    // add drawing
    var draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
            polygon: true,
            trash: true
        }
    });
    map.addControl(draw);

    map.on("draw.create", buildingFloorDrawn);


    // ------------------------------------------------------------------------------------------------------



    // ------------------------------------------------------------------------------------------------------
    // fires when a polygon is done being drawn on the map.
    // It stores the information of the vertices of this polygon as the
    // corners of the building. It updates the building_info global array
    // with the area of the building floor and the array containing data about the walls.
    function buildingFloorDrawn(e) {

        // hide map
        $("#map_to_draw_building").css("display", "none");

        // update map label
        $("#map_label").html("Your map has been drawn");

        /*var area_of_building_floor_meters_sq = (LGeo.area(e.layer) ).toFixed(2) ;
        var area_of_building_floor_feet_sq = (area_of_building_floor_meters_sq*10.7639).toFixed(2);

        building_info["area_meters_sq"] = area_of_building_floor_meters_sq;
        building_info["area_feet_sq"] = area_of_building_floor_feet_sq;
        */

        // get area of building
        var area_sq_meters = turf.area(e["features"][0]);
        var area_sq_feet = turf.convertArea(area_sq_meters, "meters", "feet");

        // store area in building_info
        if(metric_selected()){
            building_info["area_sq_meters"] = area_sq_meters;
        }else if(imperial_selected()){
            building_info["area_sq_feet"] = area_sq_feet;
        }

        // get coordinate set
        var coordinate_set_vertices = e["features"][0]["geometry"]["coordinates"][0];

        // generate wall data
        building_info["walls"] = convert_coordinates_to_walls(coordinate_set_vertices);

    }
    // ------------------------------------------------------------------------------------------
});