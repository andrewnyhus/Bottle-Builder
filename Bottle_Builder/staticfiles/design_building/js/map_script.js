
$(document).ready(function(){


  /*
    Initialize the map, it's controls,
    and set up listeners for map
  */

    mapboxgl.accessToken = 'pk.eyJ1IjoiZnVlcnRlbnVldmFjYXNhIiwiYSI6ImNqMGgzdTg5ZzAydnEyd3J1cHF4eG54eHUifQ.Aikx4qEIowhrKbSVhNEpRw';


    var map = new mapboxgl.Map({
        container: 'map_to_draw_building',
        style: 'mapbox://styles/mapbox/satellite-streets-v9',
        center: [-91.874, 42.760], // longitude, latitude
        zoom: 1,
    });

    var geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken
    });

    // add search control
    map.addControl(geocoder);


    // initialize and add drawing control
    var draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
            polygon: true,
            trash: true
        }
    });
    map.addControl(draw);

    // listener, when drawing is complete, fire buildingFloorDrawn
    map.on("draw.create", buildingFloorDrawn);


    var result_has_settled = true;

    // listen for map load finish
    // =================================================================
    map.on('load', function(){

      // hide map load spinner
      document.getElementById("map_loader").style.display = "none";

      // listen for when the geocoder is beginning to move or zoom towards
      // a location. when this happens, set the boolean and show the spinner.
      geocoder.on("result", function(){
        result_has_settled = false;
        document.getElementById("map_loader").style.display = "block";
      });


      // listen for when the geocoder has an error and make a popup alert
      // when this occurs.
      geocoder.on("error", function(){
        alert("Error finding location on map.");
      });

    });
    // =================================================================

    // listen for map move finish.
    // if the geocoder was moving and just finished, hide the spinner.
    // =================================================================
    map.on('moveend', function(){

      if(!result_has_settled){
        document.getElementById("map_loader").style.display = "none";
      }

    });
    // =================================================================


    // listen for map zoom finish.
    // if the geocoder was zooming and just finished, hide the spinner.
    // =================================================================
    map.on('zoomend', function(){

      if(!result_has_settled){
        document.getElementById("map_loader").style.display = "none";
      }

    });
    // =================================================================




    // fires when a polygon is done being drawn on the map.
    // It stores the information of the vertices of this polygon as the
    // corners of the building. It updates the building_info global array
    // with the area of the building floor and the array containing data about the walls.

    /*
      Stores the vertices of the polygon (representation of the building perimeter).
      Updates the global building_info array with this information as well as the building area.
    */
    // =============================================================================
    function buildingFloorDrawn(e) {

        // disable map editing
        document.getElementsByClassName("mapboxgl-ctrl-group")[0].remove();

        // hide help popover
        $("#help_popover").css("display", "none");

        // update map label
        $("#map_label").html("Your map has been drawn.  If you have finished the form, continue to generate an estimate or save the building design.");

        // change color of map label to green
        $("#map_label").css("color", "green");

        // get area of building
        var area_sq_meters = turf.area(e["features"][0]);
        var area_sq_feet = turf.convertArea(area_sq_meters, "meters", "feet");

        // store area in building_info
        if(metric_selected()){
            building_info["area"] = area_sq_meters.toFixed(2);
            building_info["area_units"] = "sq m";
        }else if(imperial_selected()){
            building_info["area"] = area_sq_feet.toFixed(2);
            building_info["area_units"] = "sq ft";
        }


        // get coordinate set
        var coordinate_set_vertices = e["features"][0]["geometry"]["coordinates"][0];
        // generate wall data
        building_info["walls"] = convert_coordinates_to_walls(coordinate_set_vertices);

    }
    // =============================================================================
});
