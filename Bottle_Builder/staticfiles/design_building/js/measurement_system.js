
// ------------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------------
    // Returns whether or not the user selected imperial system.
    function imperial_selected(){
        return $("#imperial_radio").prop("checked");
    }
    // ------------------------------------------------------------------------------------------------------


    // ------------------------------------------------------------------------------------------------------
    // Returns whether or not the user selected metric system.
    function metric_selected(){
        return $("#metric_radio").prop("checked");
    }
    // ------------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------------
    // empty form fields & reset variables that depend on the measurement systems
    function clear_fields_related_to_measurement_system(){
        $("#building_height_input").val("");
        $("#foundation_depth_input").val("");
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

        // update: building_height_label, bottle_volume_label, & bottle_diameter_label

        $("#building_height_label").html("Enter the height of your building (meters).");
        $("#foundation_depth_label").html("Enter the depth of your foundation (meters).  Usually this is about 0.9 meters deep, but if the soil is very moist or on a hill you should dig a little deeper.")
        $("#bottle_volume_label").html("Enter the average volume of your bottle (milliliters).");
        $("#bottle_diameter_label").html("Enter the average diameter of the bottle (centimeters).");


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


        // update: building_height_label, foundation_depth_label, bottle_volume_label, & bottle_diameter_label

        $("#building_height_label").html("Enter the height of your building (feet).");
        $("#foundation_depth_label").html("Enter the depth of your foundation (feet).  Usually this is about 3 feet deep, but if the soil is very moist or on a hill you should dig a little deeper.")
        $("#bottle_volume_label").html("Enter the average volume of your bottle (fluid ounces).");
        $("#bottle_diameter_label").html("Enter the average diameter of your bottle (inches).");


        // Update bottle fill density dropdown

        $("#bottle_fill_density_dropdown_label").html("Please enter the density of the material with which you will fill your bottles (lb/cubic feet).  The pre-loaded values are from engineeringtoolbox.com");

        $("#dry_dirt_selected").html("Dry Dirt (76 lb/cubic foot)");
        $("#dry_sand_selected").html("Dry Sand (97 lb/cubic foot)");


        // reset already entered values that depend on the measurement system
        clear_fields_related_to_measurement_system();

    }

// ------------------------------------------------------------------------------------------------------