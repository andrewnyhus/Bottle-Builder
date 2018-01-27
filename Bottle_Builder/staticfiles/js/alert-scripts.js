/*
  Shows the bad alert at the top of the page.
*/
// =============================================================================
function show_bad_alert(){
  $("#bad_alert").css("display", "block");
}
// =============================================================================



/*
  Shows the good alert at the top of the page.
*/
// =============================================================================
function show_good_alert(){
  $("#good_alert").css("display", "block");
}
// =============================================================================



/*
  Hides the bad alert at the top of the page.
*/
// =============================================================================
function hide_bad_alert(){
  $("#bad_alert").css("display", "none");
}
// =============================================================================



/*
  Hides the good alert at the top of the page.
*/
// =============================================================================
function hide_good_alert(){
  $("#good_alert").css("display", "none");
}
// =============================================================================



/*
  Sets the message for the bad alert at the top of the page.
*/
// =============================================================================
function set_message_bad_alert(message){
    $("#bad_alert").html("<p>" + message + "</p>");
    scroll(0,0);
}
// =============================================================================



/*
  Sets the message for the good alert at the top of the page.
*/
// =============================================================================
function set_message_good_alert(message){
    $("#good_alert").html("<p>" + message + "</p>");
    scroll(0,0);
}
// =============================================================================
