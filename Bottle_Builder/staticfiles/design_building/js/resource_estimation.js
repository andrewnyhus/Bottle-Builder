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


    for(i = 0; i < coordinate_set.length; i++){
            coordinate_set[i]["vertice_id"] = (i+1);

            if(i + 1 == coordinate_set.length){
                walls.push([coordinate_set[i], coordinate_set[0]]);

                walls[i]["length_meters"] = (coordinate_set[i].distanceTo(coordinate_set[0])).toFixed(3);
                walls[i]["length_feet"] = (walls[i]["length_meters"]*3.28).toFixed(3);
            }else{
                walls.push([coordinate_set[i], coordinate_set[i+1]]);
                walls[i]["length_meters"] = (coordinate_set[i].distanceTo(coordinate_set[i+1])).toFixed(3);
                walls[i]["length_feet"] = (walls[i]["length_meters"]*3.28).toFixed(3);
            }


            // if measurement system is imperial, store length in feet
    // if measurement system is metric, store length in meters
    if(get_measurement_system() == measurement_system_enum.IMPERIAL){
        walls[i]["length"] = (3.28)*(coordinate_set[i].distanceTo(coordinate_set[i+1])).toFixed(3);
            }else if(get_measurement_system() == measurement_system_enum.METRIC){
            walls[i]["length"] = (coordinate_set[i].distanceTo(coordinate_set[i+1])).toFixed(3);
            }



    }

    return walls;


}
// ------------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------
// Resource Estimate Generation
function generate_resource_estimate(){

    // if form is valid and building_info is complete, continue


}
// ------------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------
// Resource Estimate Generation Table HTML
function generate_resource_estimate_html(){

    // generate resource estimate first
    generate_resource_estimate();

    // if resource estimate generation was successful, continue
    if(building_info["resources"] != undefined){

    }else{
        $("#resource_estimate_table_div").html("<p align='center'>Cannot generate resource estimate until the form is complete.</p>");
    }

}
// ------------------------------------------------------------------------------------------------------
