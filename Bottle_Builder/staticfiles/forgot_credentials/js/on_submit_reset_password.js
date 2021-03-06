/*
  Returns whether the entered password length is valid,
  also displays alert if not.
*/
// =============================================================================
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
// =============================================================================



/*
  Returns whether the entered passwords match,
  also displays alert if not.
*/
// =============================================================================
function passwords_are_equal(){
    if(document.getElementById("password_input").value == document.getElementById("confirm_password_input").value){
        return true;
    }else{
        set_message_bad_alert("Error: Your passwords do not match.");
        show_bad_alert();
        return false;
    }
}
// =============================================================================



/*
  If the reset password form is valid and complete, sends a request for
  the server to update the specified account to the new password.
*/
// =============================================================================
function reset_password_form_submitted(){

  if(password_length_is_valid() && passwords_are_equal()){

    //disable form
    document.getElementById("password_input").disabled = true;
    document.getElementById("confirm_password_input").disabled = true;
    document.getElementById("reset_password_submit_button").disabled = true;

    // show loader
    document.getElementById("submit_loader").style.display = "inline-block";


    hide_bad_alert();
    set_message_good_alert("Setting Your New Password...");
    show_good_alert();

    var reset_url = "/reset_password/"+get_uid()+"/"+get_token()+"/";

    $.ajax({

        url: reset_url,
        type: "POST",
        data: {"password": document.getElementById("password_input").value, "csrfmiddlewaretoken": get_csrf()},

        success: function(response){

          // hide loader
          document.getElementById("submit_loader").style.display = "none";

          hide_bad_alert();
          set_message_good_alert(response);
          show_good_alert();
        },

        error: function(xhr, error_message, err){
          var response = xhr.responseJSON;

          //disable form
          document.getElementById("password_input").disabled = false;
          document.getElementById("confirm_password_input").disabled = false;
          document.getElementById("reset_password_submit_button").disabled = false;

          // hide loader
          document.getElementById("submit_loader").style.display = "none";

          hide_good_alert();
          set_message_bad_alert(response);
          show_bad_alert();


        }

    });
  }

}
// =============================================================================
