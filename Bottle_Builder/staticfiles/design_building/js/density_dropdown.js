fill_density_entry_enum = {
    DIRT : 1,
    SAND : 2,
    MANUAL : 3
}

var fill_density_entry = 0;

function get_fill_density_entry(){ return fill_density_entry; }

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
