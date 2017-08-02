

// ------------------------------------------------------------------------------------------------------
// If form is complete, stores info into building_info
function store_form_input(){
    if(form_is_valid_and_complete()){

    }
}
// ------------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------
// Checks that each form field is valid and filled.
function form_is_valid_and_complete(){

    return measurement_system_is_selected() &&
            num_pillars_is_valid();

}
// ------------------------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------------------------
// Checks that either the metric or imperial system are picked
function measurement_system_is_selected(){
    if(get_measurement_system() == 1 || get_measurement_system() == 2){
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
    var num_pillars_input;

    // if input is blank, display alert
    if(num_pillars_input == ""){
        set_message_bad_alert("Please enter the # of pillars");
        show_bad_alert();
        return false;
    }

    var regexp = new RegExp("[0-9]", "g");

    // if input has non-numeric characters, display alert
    if(num_pillars_input.match(regexp).join() != num_pillars_input.split("").join()){
        set_message_bad_alert("The # of pillars should contain no spaces or non-numeric characters.");
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
// Checks that building height is valid
function building_height_is_valid(){
    var building_height_input;

    // if input is blank
    if(building_height_input == ""){
        set_message_bad_alert("Please enter the building height");
        show_bad_alert();
        return false;
    }

    var regexp = new RegExp("[0-9]|[.]", "g");

    // if input has non-numeric characters aside from '.', display alert
    if(building_height_input.match(regexp).join() != building_height_input.split("").join()){
        set_message_bad_alert("The building height should include only numbers & periods.");
        show_bad_alert();
        return false;
    }

    // if input is not positive, display alert
    if(!building_height_input > 0 ){
        set_message_bad_alert("The building height must be a positive number.");
        show_bad_alert();
        return false;
    }

    return true;

}
// ------------------------------------------------------------------------------------------------------
