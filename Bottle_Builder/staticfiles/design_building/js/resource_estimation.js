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
    if(!store_form_input()){return;}

    var resource_estimate = {};

    // set up resource_estimate
    //=====================================================================================================================
    resource_estimate["bottles"] = {};
    resource_estimate["fill"] = {};
    resource_estimate["cement"] = {};
    //=====================================================================================================================

    // store some info into resource_estimate
    //=====================================================================================================================

    resource_estimate["num_walls"] = building_info["walls"].length;


    resource_estimate["bottle_units"] = "Bottles (" +building_info["average_bottle_volume"] + " " + building_info["average_bottle_volume_units"] + " w/ height: " +building_info["average_bottle_height"]+" "+building_info["average_bottle_height_units"]+ " and diameter: "+ building_info["average_bottle_diameter"] +" "+ building_info["average_bottle_diameter_units"] + ")";

    // store fill units in resource estimate

    if(metric_selected()){

        if(get_fill_density_entry() == 1){ // if fill is dirt
            resource_estimate["fill_units"] = "Dirt (kg)";
        }else if(get_fill_density_entry() == 2){ // if fill is sand
            resource_estimate["fill_units"] = "Sand (kg)";
        }else{ // Unknown fill
            resource_estimate["fill_units"] = "Unknown Fill (kg)";
        }

        resource_estimate["cements_units"] = "Cement (kg)";
    }else if(imperial_selected()){

        if(get_fill_density_entry() == 1){ // if fill is dirt
            resource_estimate["fill_units"] = "Dirt (lb)";
        }else if(get_fill_density_entry() == 2){ // if fill is sand
            resource_estimate["fill_units"] = "Sand (lb)";
        }else{ // Unknown fill
            resource_estimate["fill_units"] = "Unknown Fill (lb)";
        }

        resource_estimate["cement_units"] = "Cement (lb)";
    }
    //=====================================================================================================================


    // create variables for building-wide information
    //=====================================================================================================================
    var bottle_diameter = parseFloat(building_info["average_bottle_diameter"]);
    var bottle_volume = parseFloat(building_info["average_bottle_volume"]);
    var bottle_height = parseFloat(building_info["average_bottle_height"]);
    var building_height = parseFloat(building_info["building_height"]);
    var cement_density = parseFloat(building_info["cement_density"]);
    var fill_density = parseFloat(building_info["fill_density"]);
    var width_between_bottles = parseFloat(building_info["width_between_bottles"]);
    //=====================================================================================================================

    

    // calculate & store the mass of cement needed
    //=====================================================================================================================
    var foundation_volume = parseFloat(building_info["foundation_depth"]) * parseFloat(building_info["area"]);
    resource_estimate["cement"]["foundation"] = (cement_density * foundation_volume).toFixed(2);
    //=====================================================================================================================


    // generate resource estimates for walls
    //=====================================================================================================================

    // iterate through all walls
    for(i = 0; i < building_info["walls"].length; i++){

        // store variables for num rows & num bottles per row
        var num_rows;
        var num_bottles_per_row;

        // calculate num bottles, fill and cement for wall
        if(metric_selected()){

            // calculate num bottles needed for wall
            //=====================================================================================================================
            // create variable for wall length
            var wall_length_m = parseFloat(building_info["walls"][i]["length"]);


            // calculate num rows
            num_rows = (building_height * 100)/(bottle_diameter + width_between_bottles);

            // calculate num bottles per row
            num_bottles_per_row = (wall_length_m * 100)/(bottle_diameter + width_between_bottles);

            // calculate and store the number of bottles
            var num_bottles = num_rows * num_bottles_per_row;
            resource_estimate["bottles"]["wall_" + (i+1)] = Math.round(num_bottles);
            //=====================================================================================================================

            // calculate mass of fill needed for wall
            //=====================================================================================================================
            // convert bottle volume
            var bottle_volume_l = bottle_volume * 0.001;
            var bottle_volume_cubic_m = bottle_volume_l * 0.001;
            var bottle_volume_wall_cubic_m = bottle_volume_cubic_m * num_bottles;

            // calculate and store volume
            var fill_mass_kg = bottle_volume_wall_cubic_m * fill_density;
            resource_estimate["fill"]["wall_" + (i+1)] = fill_mass_kg.toFixed(2);
            //=====================================================================================================================


            // calculate mass of cement needed for wall
            //=====================================================================================================================
            // get width between bottles in meters
            var width_between_bottles_m = width_between_bottles/100;

            // calculate cement volume
            var cement_cubic_m = (width_between_bottles_m * bottle_diameter * bottle_height) * 2 * num_bottles;

            // convert to mass
            var cement_mass_kg = cement_density * cement_cubic_m;

            // store cement mass
            resource_estimate["cement"]["wall_" + (i+1)] = cement_mass_kg.toFixed(2);
            //=====================================================================================================================

        }else if(imperial_selected()){

            // calculate num bottles needed for wall
            //=====================================================================================================================
            // create variable for wall length
            var wall_length_ft = parseFloat(building_info["walls"][i]["length"]);

            // calculate num rows
            num_rows = (building_height * 12)/(bottle_diameter + width_between_bottles);

            // calculate num bottles per row
            num_bottles_per_row = (wall_length_ft * 12)/(bottle_diameter + width_between_bottles);

            // calculate and store the number of bottles
            var num_bottles = num_rows * num_bottles_per_row;
            resource_estimate["bottles"]["wall_" + (i+1)] = Math.round(num_bottles);
            //=====================================================================================================================


            // calculate mass of fill needed for wall
            //=====================================================================================================================
            // convert bottle volume
            var bottle_volume_cubic_ft = bottle_volume * 0.00104438;  // convert US fl oz to cubic feet
            var bottle_volume_wall_cubic_ft = bottle_volume_cubic_ft * num_bottles;


            // calculate and store volume
            var weight_lb = bottle_volume_wall_cubic_ft * fill_density;
            resource_estimate["fill"]["wall_" + (i+1)] = weight_lb.toFixed(2);
            //=====================================================================================================================

            // calculate mass of cement needed for wall
            //=====================================================================================================================
            // get width between bottles in feet
            var width_between_bottles_ft = width_between_bottles/12;

            // calculate cement volume
            var cement_cubic_ft = (width_between_bottles_ft * bottle_diameter * bottle_height) * 1.5 * num_bottles;


            // calculate cement mass
            var cement_mass_lb = cement_density * cement_cubic_ft;
            // store mass
            resource_estimate["cement"]["wall_" + (i+1)] = cement_mass_lb.toFixed(2);
            //=====================================================================================================================

        }


    }
    //=====================================================================================================================

    // TODO: generate estimate
    return resource_estimate;

}
// ------------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------
// Resource Estimate Generation Table HTML
function generate_resource_estimate_html(){

    var resource_estimate = generate_resource_estimate();
    // generate resource estimate first
    if(resource_estimate != undefined){

        console.log("resource estimate:");
        console.log(resource_estimate);

        // create table header
        //=====================================================================================================================
        var table_header = "<h4 align='center'>This estimate is not tested, and is theoretical.  It also assumes the concrete density is 1400 kg/cubic meter (87.39 lb/cubic foot)</h4><div class='container'><table class='table table-bordered'>";

        // include bottle in header
        table_header += "<thead><tr><th></th><th>"+ resource_estimate["bottle_units"] + "</th>";
        // include fill in header
        table_header += "<th>" + resource_estimate["fill_units"] + "</th>";
        // include cement in header
        table_header += "<th>" + resource_estimate["cement_units"] + "</th>";

        table_header += "</tr></thead>";
        //=====================================================================================================================

        // create table body
        //=====================================================================================================================
        var table_body = "<tbody>";

        // total estimate variables
        var total_bottles = 0;
        var total_fill = 0;
        var total_cement = 0;



        // include foundation
        table_body += "<tr><td>Foundation</td>";
        // include blank <td> for bottle and fill estimates, and include value for cement estimate
        table_body += "<td></td><td></td><td>" + parseFloat(resource_estimate["cement"]["foundation"]).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) + "</td></tr>";

        // add up foundation to cement total
        total_cement = parseFloat(resource_estimate["cement"]["foundation"]);

        // include walls, iterate through walls and include a row for each as well as a total
        //=====================================================================================================================
        var num_walls = parseInt(resource_estimate["num_walls"]);

        // total wall estimate variables
        var total_bottles_for_walls = 0;
        var total_fill_for_walls = 0;
        var total_cement_for_walls = 0;

        // iterate & include rows in html
        for(i = 0; i < num_walls; i++){

            // include wall # in first column of new row
            table_body += "<tr><td>Wall " + (i+1) + "</td>";
            // include bottle estimate in second column
            table_body += "<td>" + parseInt(resource_estimate["bottles"]["wall_" + (i+1)]).toLocaleString() + "</td>";
            // include fill estimate in third column
            table_body += "<td>" + parseFloat(resource_estimate["fill"]["wall_" + (i+1)]).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) + "</td>";
            // include cement estimate in fourth column
            table_body += "<td>" + parseFloat(resource_estimate["cement"]["wall_" + (i+1)]).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) + "</td>";
            // close row
            table_body += "</tr>";

            // add up current wall to total wall estimate
            total_bottles_for_walls += parseInt(resource_estimate["bottles"]["wall_" + (i+1)]);
            total_fill_for_walls += parseFloat(resource_estimate["fill"]["wall_" + (i+1)]);
            total_cement_for_walls += parseFloat(resource_estimate["cement"]["wall_" + (i+1)]);
        }

        // Start Wall Total Row
        table_body += "<tr><td>Total (Walls)</td>";
        // include total bottle estimate for walls in second column
        table_body += "<td>" + total_bottles_for_walls.toLocaleString() + "</td>";
        // include total fill estimate for walls in third column
        table_body += "<td>" + total_fill_for_walls.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) + "</td>";
        // include total cement estimate for walls in fourth column
        table_body += "<td>" + total_cement_for_walls.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) + "</td>";
        // close row
        table_body += "</tr>";


        // Add up wall totals to total variables
        total_bottles += total_bottles_for_walls;
        total_fill += total_fill_for_walls;
        total_cement += total_cement_for_walls;

        //=====================================================================================================================

        // Include Estimate for Pillars
        //=====================================================================================================================
        var num_pillars = parseInt(resource_estimate["num_pillars"]);

        if(num_pillars > 0){
            // Calculate and Include Row for Estimate of a Single Pillar
            //=====================================================================================================================
            //=====================================================================================================================

            // Start Total Pillars Row

        }

        //=====================================================================================================================



        // Start Total Row
        table_body += "<tr><td>Total</td>";
        // include total bottle estimate in second column
        table_body += "<td>" + total_bottles.toLocaleString() + "</td>";
        // include total fill estimate in third column
        table_body += "<td>" + total_fill.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) + "</td>";
        // include total cement estimate in fourth column
        table_body += "<td>" + total_cement.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) + "</td>";
        // close row
        table_body += "</tr>";


        // close body
        table_body += "</tbody>";
        //=====================================================================================================================



        var table_footer = "</table></div>";

        // create table html string
        var table = table_header + table_body + table_footer;

        // set html for table
        $("#resource_estimate_table_div").html(table);

        // scroll to bottom
        window.scrollTo(0, document.body.scrollHeight);

    }
}


// ------------------------------------------------------------------------------------------------------


