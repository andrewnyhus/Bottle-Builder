

// ------------------------------------------------------------------------------------------------------
// If form is complete, stores info into building_info
function store_form_input(){
    if(form_is_valid_and_complete()){
        // store info

        // store units
        if(imperial_selected()){
            building_info["measurement_system"] = "imperial";
            building_info["building_height_units"] = "ft";
            building_info["average_bottle_volume_units"] = "US fl oz";
            building_info["average_bottle_diameter_units"] = "in";
            building_info["average_bottle_height_units"] = "in";
            building_info["fill_density_units"] = "lb/cubic ft";
            building_info["foundation_depth_units"] = "ft";
            building_info["pillar_depth_units"] = "in";
            building_info["width_between_bottles_units"] = "in";
        }else if(metric_selected()){
            building_info["measurement_system"] = "metric";
            building_info["building_height_units"] = "m";
            building_info["average_bottle_volume_units"] = "mL";
            building_info["average_bottle_diameter_units"] = "cm";
            building_info["average_bottle_height_units"] = "cm";
            building_info["fill_density_units"] = "kg/cubic m";
            building_info["foundation_depth_units"] = "m";
            building_info["pillar_depth_units"] = "cm";
            building_info["width_between_bottles_units"] = "cm";
        }

        // store num pillars
        building_info["num_pillars"] = $("#num_pillars_input").val();

        // if pillar depth field is empty, set pillar depth to 0
        // otherwise, set it to the value in the field.
        if($("#pillar_depth_input").val() == ""){
            building_info["pillar_depth"] = 0;
        }else{
            building_info["pillar_depth"] = $("#pillar_depth_input").val();
        }


        // store building height
        building_info["building_height"] = $("#building_height_input").val();

        // store foundation depth
        building_info["foundation_depth"] = $("#foundation_depth_input").val();

        // store width between bottles
        building_info["width_between_bottles"] = $("#width_between_bottles_input").val();

        // store avg. bottle volume
        building_info["average_bottle_volume"] = $("#bottle_volume_input").val();

        // store avg. bottle diameter
        building_info["average_bottle_diameter"] = $("#bottle_diameter_input").val();

        // store avg. bottle height
        building_info["average_bottle_height"] = $("#bottle_height_input").val();

        // store fill density
        building_info["fill_density"] = "" + get_fill_density();


        // store cement density
        if(imperial_selected()){
            building_info["cement_density"] = 87.39914;
            building_info["cement_density_units"] = "pounds/cubic foot";
        }else if(metric_selected()){
            building_info["cement_density"] = 1400;
            building_info["cement_density_units"] = "kg/cubic meter";
        }

        return true;
    }
    return false;
}
// ------------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------
// Checks that each form field is valid and filled.
function form_is_valid_and_complete(){

    set_message_bad_alert("");
    hide_bad_alert();

    if(!measurement_system_is_selected()){return false;}
    if(!num_pillars_is_valid()){return false;}

    if(!input_is_positive_number($("#building_height_input").val(), "building height")){return false;}
    if(!pillar_depth_is_valid()){return false;}
    if(!input_is_positive_number($("#foundation_depth_input").val(), "foundation depth")){return false;}
    if(!input_is_positive_number($("#width_between_bottles_input").val(), "width between bottles")){return false;}
    if(!input_is_positive_number($("#bottle_volume_input").val(), "average bottle volume")){return false;}
    if(!input_is_positive_number($("#bottle_diameter_input").val(), "average bottle diameter")){return false;}
    if(!input_is_positive_number($("#bottle_height_input").val(), "average bottle height")){return false;}

    if(!fill_density_is_selected()){ return false;}

    if(!map_was_drawn()){return false;}

    return true;

}
// ------------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------
// Checks that either the metric or imperial system are picked
function measurement_system_is_selected(){
    if($("#imperial_radio").prop("checked") || $("#metric_radio").prop("checked")){
        return true;
    }else{
        set_message_bad_alert("Please select a measurement system.");
        show_bad_alert();
        return false;
    }
}
// ------------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------------
// Checks that the number of pillars entered is valid (0, 3, or more)
function num_pillars_is_valid(){
    var num_pillars_input = $("#num_pillars_input").val();

    // if input is blank, display alert
    if(num_pillars_input == ""){
        set_message_bad_alert("Please enter the # of pillars (only numeric characters)");
        show_bad_alert();
        return false;
    }

    // if num pillars is not 0, 3 or greater, display alert
    if(!(num_pillars_input == 0 || num_pillars_input >= 3)){
        set_message_bad_alert("The # of pillars should be 0, 3 or greater");
        show_bad_alert();
        return false;
    }

    return true;

}
// ------------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------------
// Checks that input is a positive number
function input_is_positive_number(input, input_description){

    // if input is blank
    if(input == ""){
        set_message_bad_alert("Please enter the "+ input_description + " (only numeric characters)");
        show_bad_alert();
        return false;
    }


    // if input is not positive, display alert
    if(!(input > 0) ){
        set_message_bad_alert("The "+input_description+" must be a positive number.");
        show_bad_alert();
        return false;
    }

    return true;

}
// ------------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------------
// Checks that fill density was selected
function fill_density_is_selected(){
    var density_entry = get_fill_density_entry();

    if(!(density_entry == 1 || density_entry == 2 || density_entry == 3)){
        set_message_bad_alert("Please select/enter a fill density (for manual entry, only numeric characters).");
        show_bad_alert();
        return false;
    }

    if(density_entry == 3 && !(input_is_positive_number($("#manual_entry_bottle_fill_density").val(), "bottle fill density"))){
        return false;
    }

    return true;
}
// ------------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------------
// Checks that the map was drawn
function map_was_drawn(){

    // if map was not drawn, display alert and return false
    if(building_info["walls"] == undefined){
        set_message_bad_alert("Please draw the building perimeter on the map.");
        show_bad_alert();
        return false;
    }
    // otherwise return true
    return true;
}
// ------------------------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------------------
// Checks that pillar depth is valid
function pillar_depth_is_valid(){

    // num pillars is 0, 3 or greater
    if(num_pillars_is_valid()){

        var num_pillars = $("#num_pillars_input").val();

        if(num_pillars > 0){// if num pillars is positive, we want to make sure that pillar depth is too.

            // if pillar depth input is not a positive number display alert and return false
            if(!input_is_positive_number($("#pillar_depth_input").val(), "pillar depth")){return false;}
        }

    }else{
        // if num pillars is not valid, an alert was already shown, we just return false
        return false;
    }

    // otherwise return true
    return true;
}
// ------------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------
// Post Building Design
function post_building_design(){

    var resource_estimate = generate_resource_estimate();

    // stop if resource estimate or form validation fails
    if(resource_estimate == undefined){return false;}

    building_info["resource_estimate"] = resource_estimate;

    console.log("building info:");
    console.log(building_info);


    $.ajax({

        url: "/post_bottle_building_design/",
        type: "POST",
        data: building_info,

        success: function(response){
            set_message_good_alert(response["message"]);
            show_good_alert();
            if(response["url"] != undefined){
                document.location = response["url"];
            }

            console.log(response);
        },

        error: function(xhr, error_message, err){
            var response = xhr.responseJSON;
            console.log(response);
        }

    });

}
// ------------------------------------------------------------------------------------------------------
