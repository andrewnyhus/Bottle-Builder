// returns false and creates alert if password is an invalid length
// otherwise returns true
function password_length_is_valid(){

    if(document.getElementById("password_input").value.length >= 30){
        set_message_bad_alert("Error: Your password exceeds 30 characters");
        show_bad_alert();
        return false;
    }else if(document.getElementById("password_input").value.length <= 5){
        set_message_bad_alert("Error: Your password must be at least 5 characters");
        show_bad_alert();
        return false;
    }else{
        return true;
    }

}

// returns false and creates alert if passwords don't match
// otherwise returns true
function passwords_are_equal(){
    if(document.getElementById("password_input").value == document.getElementById("confirm_password_input").value){
        return true;
    }else{
        set_message_bad_alert("Error: Your passwords do not match.");
        show_bad_alert();
        return false;
    }
}


function reset_password_form_submitted(){

  if(password_length_is_valid() && passwords_are_equal()){
    //disable form
    document.getElementById("password_input").disabled = true;
    document.getElementById("confirm_password_input").disabled = true;
    document.getElementById("reset_password_submit_button").disabled = true;


    hide_bad_alert();
    set_message_good_alert("Setting Your New Password...");
    show_good_alert();

    var reset_url = "/reset_password/"+get_uid()+"/"+get_token()+"/";

    $.ajax({

        url: reset_url,
        type: "POST",
        data: {"password": document.getElementById("password_input").value},

        success: function(response){
          hide_bad_alert();
          set_message_good_alert(response);
          show_good_alert();
        },

        error: function(xhr, error_message, err){
          var response = xhr.responseJSON;

          hide_good_alert();
          set_message_bad_alert(response);
          show_bad_alert();

          //disable form
          document.getElementById("password_input").disabled = false;
          document.getElementById("confirm_password_input").disabled = false;
          document.getElementById("reset_password_submit_button").disabled = false;

        }

    });
  }

}
