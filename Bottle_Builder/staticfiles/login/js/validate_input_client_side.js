
/*
  Returns whether the username length is valid,
  also displays an alert if not.
*/
// =============================================================================
function username_length_is_valid(){

    if($("#username").val().length >= 30){
        set_message_bad_alert("Error: Your username exceeds 30 characters");
        show_bad_alert();
        return false;
    }else if($("#username").val().length <= 5){
        set_message_bad_alert("Error: Your username must be at least 5 characters");
        show_bad_alert();
        return false;
    }else{
        return true;
    }

}
// =============================================================================



/*
  Returns whether the username characters are all valid,
  also displays an alert if not.
*/
// =============================================================================
function username_contains_only_valid_characters(){

    var proposed_username = $("#username").val();
    var reg = new RegExp("[a-z]|[A-Z]|[0-9]|[_]|[-]", "g");

    // split proposed username into array of acceptable characters
    var result = proposed_username.match(reg);

    // split proposed username by into array of all characters,
    // join both arrays into a string and compare.
    var username_characters_are_valid = result.join() === proposed_username.split("").join();

    if(!username_characters_are_valid){
        set_message_bad_alert("Error: Your username contains invalid characters.  Please include only letters, numbers, dashes and underscores");
        show_bad_alert();
        return false;
    }else{
        return true;
    }

}
// =============================================================================



/*
  Returns whether the password length is valid,
  also displays an alert if not.
*/
// =============================================================================
function password_length_is_valid(){

    if($("#password").val().length >= 30){
        set_message_bad_alert("Error: Your password exceeds 30 characters");
        show_bad_alert();
        return false;
    }else if($("#password").val().length <= 5){
        set_message_bad_alert("Error: Your password must be at least 5 characters");
        show_bad_alert();
        return false;
    }else{
        return true;
    }

}
// =============================================================================
