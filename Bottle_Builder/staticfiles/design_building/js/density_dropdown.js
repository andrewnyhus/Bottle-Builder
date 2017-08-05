fill_density_entry_enum = {
    DIRT : 1,
    SAND : 2,
    MANUAL : 3
}

var fill_density_entry = 0;

function get_fill_density_entry(){ return fill_density_entry; }

function get_fill_density(){
    var density_entry = get_fill_density_entry();

    if(!(density_entry == 1 || density_entry == 2 || density_entry == 3)||(density_entry == 3 && $("#manual_entry_bottle_fill_density").val() == "")){
        return -1;
    }

    if(imperial_selected()){// if imperial

        if(density_entry == 1){ // if dirt

        }else if(density_entry == 2){ // if sand

        }else if(density_entry == 3){ // if manual

        }

    }else if(metric_selected()){// if metric

        if(density_entry == 1){ // if dirt

        }else if(density_entry == 2){ // if sand

        }else if(density_entry == 3){ // if manual

        }

    }
}

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
