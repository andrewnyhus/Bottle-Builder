// ------------------------------------------------------------------------------------------------------
var building_info = {};


// getter for building_info
function get_building_info(){
    return building_info;
}
// ------------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------
// helper function to buildingFloorDrawn.
// provides an array that contains info pertaining to walls
function convert_coordinates_to_walls(coordinate_set){
    var walls = [];


    for(i = 0; i < coordinate_set.length - 1; i++){
            coordinate_set[i]["vertice_id"] = (i+1);

            // create walls[i]] & include coordinates
            walls.push({});
            walls[i][0] = coordinate_set[i];
            walls[i][1] = coordinate_set[i+1];

            // put distance in either meters or feet
            // into walls[i]
            if(metric_selected()){
                walls[i]["length"] = turf.distance(coordinate_set[i], coordinate_set[i+1], "meters")
                walls[i]["length_units"] = "meters";
            }else if(imperial_selected()){
                walls[i]["length"] = turf.distance(coordinate_set[i], coordinate_set[i+1], "feet")
                walls[i]["length_units"] = "feet";
            }


    }

    return walls;


}
// ------------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------
// Resource Estimate Generation
function generate_resource_estimate(){

    // if form is valid and building_info is complete, continue
    if(!store_form_input()){return false;}


    // TODO: generate estimate
    return true;

}
// ------------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------
// Resource Estimate Generation Table HTML
function generate_resource_estimate_html(){

    // generate resource estimate first
    if(generate_resource_estimate()){
        //TODO: create table

    }
}


// ------------------------------------------------------------------------------------------------------


