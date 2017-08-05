

// ------------------------------------------------------------------------------------------------------
// If form is complete, stores info into building_info
function store_form_input(){
    if(form_is_valid_and_complete()){
        // store info

        // store measurement system
        if(imperial_selected()){
            building_info["measurement_system"] = "imperial";
        }else if(metric_selected()){
            building_info["measurement_system"] = "metric";
        }

        // store num pillars
        building_info["num_pillars"] = $("#num_pillars_input").val();

        // store building height
        building_info["building_height"] = $("#building_height_input").val();

        // store avg. bottle volume
        building_info["average_bottle_volume"] = $("#bottle_volume_input").val();

        // store avg. bottle diameter
        building_info["average_bottle_diameter"] = $("#bottle_diameter_input").val();

        // store bottle fill density

        // TODO: FINISH


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
    if(!input_is_positive_number($("#bottle_volume_input").val(), "average bottle volume")){return false;}
    if(!input_is_positive_number($("#bottle_diameter_input").val(), "average bottle diameter")){return false;}

    if(!fill_density_is_selected()){ return false;}

    // TODO: Include Map Data in Validation

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
