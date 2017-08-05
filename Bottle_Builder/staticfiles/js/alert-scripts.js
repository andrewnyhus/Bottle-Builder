function show_bad_alert(){ $("#bad_alert").css("display", "block"); }
function show_good_alert(){ $("#good_alert").css("display", "block"); }

function hide_bad_alert(){ $("#bad_alert").css("display", "none"); }
function hide_good_alert(){ $("#good_alert").css("display", "none"); }

function set_message_bad_alert(message){
    $("#bad_alert").html("<p>" + message + "</p>");
    scroll(0,0);
}
function set_message_good_alert(message){
    $("#good_alert").html("<p>" + message + "</p>");
    scroll(0,0);
}