// options for fill density dropdown
fill_density_entry_enum = {
    DIRT : 1,
    SAND : 2,
    MANUAL : 3
}

// initialize density entry to unselected
var fill_density_entry = 0;


/*
  Returns the fill density selection, not the density value.
  Returns 0 if unselected.
*/
// =============================================================================
function get_fill_density_entry(){
  return fill_density_entry;
}
// =============================================================================


/*
  Returns the fill density value.
  Returns -1 if the density is not selected or entered.
*/
// =============================================================================
function get_fill_density(){
    var density_entry = get_fill_density_entry();

    // return -1 if density is not selected or entered
    if(!(density_entry == 1 || density_entry == 2 || density_entry == 3)||(density_entry == 3 && $("#manual_entry_bottle_fill_density").val() == "")){
        return -1;
    }

    // if user is using imperial system, return value in lb/cubic foot
    if(imperial_selected()){

        if(density_entry == 1){ // if dirt
            return 76;
        }else if(density_entry == 2){ // if sand
            return 97;
        }else if(density_entry == 3){ // if manual
            return $("#manual_entry_bottle_fill_density").val();
        }

    // if user is using metric system, return value in kg/cubic meter
    }else if(metric_selected()){

        if(density_entry == 1){ // if dirt
            return 1220;
        }else if(density_entry == 2){ // if sand
            return 1555;
        }else if(density_entry == 3){ // if manual
            return $("#manual_entry_bottle_fill_density").val();
        }

    }
}
// =============================================================================

/*
  On click listeners for the fill density dropdown items.
  
*/
// =============================================================================
$("#dry_dirt_selected").on("click", function(){
    $("#manual_entry_bottle_fill_density").css("display", "none");

    fill_density_entry = fill_density_entry_enum.DIRT;

    $("#bottle_fill_density_dropdown_button").html($("#dry_dirt_selected").html());
});

$("#dry_sand_selected").on("click", function(){
    $("#manual_entry_bottle_fill_density").css("display", "none");

    fill_density_entry = fill_density_entry_enum.SAND;

    $("#bottle_fill_density_dropdown_button").html($("#dry_sand_selected").html());
});

$("#manual_entry_selected").on("click", function(){
    $("#manual_entry_bottle_fill_density").css("display", "block");

    fill_density_entry = fill_density_entry_enum.MANUAL;
    $("#bottle_fill_density_dropdown_button").html("Manual Entry");
});
// =============================================================================
