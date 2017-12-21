

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
            building_info["width_between_bottles_units"] = "in";
        }else if(metric_selected()){
            building_info["measurement_system"] = "metric";
            building_info["building_height_units"] = "m";
            building_info["average_bottle_volume_units"] = "mL";
            building_info["average_bottle_diameter_units"] = "cm";
            building_info["average_bottle_height_units"] = "cm";
            building_info["fill_density_units"] = "kg/cubic m";
            building_info["foundation_depth_units"] = "m";
            building_info["width_between_bottles_units"] = "cm";
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
            building_info["cement_density_units"] = "lbs/cubic ft";
        }else if(metric_selected()){
            building_info["cement_density"] = 1400;
            building_info["cement_density_units"] = "kg/cubic m";
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

    if(!input_is_positive_number($("#building_height_input").val(), "building height")){return false;}
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
// Post Building Design
function post_building_design(){

    var resource_estimate;

    // resource estimate has yet to be generated, generate it.
    if(building_info["resource_estimate"] == undefined){
        resource_estimate = generate_resource_estimate();
    }

    // stop if resource estimate or form validation fails
    if(resource_estimate == undefined){return false;}

    // stop if the title is too long
    if(document.getElementById("building_title_input").value.length > 40){
      hide_good_alert();
      set_message_bad_alert("Please enter a title that is under 40 characters");
      show_bad_alert();

      return false;
    }


    var post_data = {"resource_estimate": resource_estimate, "walls": building_info["walls"],
                     "visible_link": document.getElementById("visible_to_link_checkbox").checked,
                     "visible_members": document.getElementById("visible_to_members_checkbox").checked,
                     "visible_public": document.getElementById("visible_to_public_checkbox").checked,
                     "title": document.getElementById("building_title_input").value
                   };



    $.ajax({

        url: "/post_bottle_building_design/",
        type: "POST",
        data: {"data_string": JSON.stringify(post_data), csrfmiddlewaretoken: get_token()},

        success: function(response){
            set_message_good_alert("Building Design Created! Redirecting to: <a href='" +response + "'> " + response + "</a>");
            show_good_alert();

            document.location = response;

        },

        error: function(xhr, error_message, err){
            var response = xhr.responseJSON;

            hide_good_alert();
            set_message_bad_alert(err);
            show_bad_alert();
        }

    });

}
// ------------------------------------------------------------------------------------------------------
