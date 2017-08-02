// create enum for switching between measurement systems
measurement_system_enum = {
    METRIC : 1,
    IMPERIAL : 2
}

var measurement_system;

// ------------------------------------------------------------------------------------------------------
    // return measurement_system. 1 = Metric, 2 = Imperial
    function get_measurement_system(){
        return measurement_system;
    }
    // ------------------------------------------------------------------------------------------------------


    // ------------------------------------------------------------------------------------------------------
    function measurement_system_button_clicked(){
        // if using metric, switch to imperial & update html
        if(measurement_system == 1){
            measurement_system = measurement_system_enum.IMPERIAL;
            set_page_to_imperial();

        }else if(measurement_system == 2){
        // if using imperial, switch to metric & update html
            measurement_system = measurement_system_enum.METRIC;
            set_page_to_metric();
        }
    }
    // ------------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------------
    // empty form fields & reset variables that depend on the measurement systems
    function clear_fields_related_to_measurement_system(){
        $("#building_height_input").val("");
        $("#bottle_volume_input").val("");
        $("#bottle_diameter_input").val("");

        $("#bottle_fill_density_dropdown_button").html("Select Bottle Fill Material/Density");
        $("#manual_entry_bottle_fill_density").css("display", "none");
        $("#manual_entry_bottle_fill_density").val("0");
        fill_density_entry = 0;
    }
    // ------------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------------
    // update the page to show units for the metric system
    function set_page_to_metric(){
        measurement_system = measurement_system_enum.METRIC;

        // update: building_height_label, bottle_volume_label, & bottle_diameter_label

        $("#building_height_label").html("Enter the height of your building (meters).");
        $("#bottle_volume_label").html("Enter the volume of your bottle (milliliters).  We assume that the bottle are of uniform volume, if they are not please provide your best average of the bottles.");
        $("#bottle_diameter_label").html("Enter the diameter of the bottle (centimeters).  We assume that the bottle are of uniform diameter, if they are not please provide your best average of the bottles.");


        // Update bottle fill density dropdown

        $("#bottle_fill_density_dropdown_label").html("Please enter the density of the material with which you will fill your bottles (kg/cubic meter).  The pre-loaded values are from engineeringtoolbox.com");

        $("#dry_dirt_selected").html("Dry Dirt (1220 kg/cubic meter)");
        $("#dry_sand_selected").html("Dry Sand (1555 kg/cubic meter)");

        // reset already entered values that depend on the measurement system
        clear_fields_related_to_measurement_system();

    }
    // ------------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------------
    // update the page to show units for the imperial system
    function set_page_to_imperial(){
        measurement_system = measurement_system_enum.IMPERIAL;


        // update: building_height_label, bottle_volume_label, & bottle_diameter_label

        $("#building_height_label").html("Enter the height of your building (feet).");
        $("#bottle_volume_label").html("Enter the volume of your bottle (fluid ounces).  We assume that the bottle are of uniform volume, if they are not please provide your best average of the bottles.");
        $("#bottle_diameter_label").html("Enter the diameter of the bottle (inches).  We assume that the bottle are of uniform diameter, if they are not please provide your best average of the bottles.");


        // Update bottle fill density dropdown

        $("#bottle_fill_density_dropdown_label").html("Please enter the density of the material with which you will fill your bottles (lb/cubic feet).  The pre-loaded values are from engineeringtoolbox.com");

        $("#dry_dirt_selected").html("Dry Dirt (76 lb/cubic feet)");
        $("#dry_sand_selected").html("Dry Sand (97 lb/cubic feet)");


        // reset already entered values that depend on the measurement system
        clear_fields_related_to_measurement_system();

    }

// ------------------------------------------------------------------------------------------------------