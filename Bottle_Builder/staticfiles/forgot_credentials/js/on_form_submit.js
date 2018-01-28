/*
  Returns whether a string is a valid email,
  also displays alert if not.
*/
// =============================================================================
function email_is_valid(email){
  var index_of_at_symbol = email.indexOf("@");

  // if the "email" doesn't contain '@', then it is invalid
  if (index_of_at_symbol == -1){
    return false;
  }

  var second_half_of_email = email.substring(index_of_at_symbol, email.length);
  // if the second half of the "email" contains no '.', it is invalid
  if (second_half_of_email.indexOf(".") == -1){
    return false;
  }

  // check if length is valid
  if(email.length >= 50 || email.length <= 5){
      return false;
  }

  return true;
}
// =============================================================================



/*
  If the form is valid and complete, sends a request for the server to send
  an email to the user containing their username.
*/
// =============================================================================
function forgot_username_form_submitted(){
  // get email value
  var email = document.getElementById("forgot_username_email_input").value;

  if (email_is_valid(email)){

    // show loader
    document.getElementById("username_loader").style.display = "inline-block";

    // disable form
    document.getElementById("forgot_username_email_input").disabled = true;
    document.getElementById("forgot_username_submit_button").disabled = true;


    $.ajax({

        url: "/forgot_username/",
        type: "POST",
        data: {"email": email, "csrfmiddlewaretoken": get_csrf()},

        success: function(response){

          // hide loader
          document.getElementById("username_loader").style.display = "none";

          hide_bad_alert();
          set_message_good_alert("Please check your email for your username.");
          show_good_alert();
        },

        error: function(xhr, error_message, err){
          var response = xhr.responseJSON;

          // hide loader
          document.getElementById("username_loader").style.display = "none";

          // re-enable form
          document.getElementById("forgot_username_email_input").disabled = false;
          document.getElementById("forgot_username_submit_button").disabled = false;

          hide_good_alert();
          set_message_bad_alert(response);
          show_bad_alert();

        }

    });
  }
}
// =============================================================================



/*
  If the form is valid and complete, sends a request for the server to send
  an email to the user containing a password reset link.
*/
// =============================================================================
function forgot_password_form_submitted(){
  // get email value
  var email = document.getElementById("forgot_password_email_input").value;

  if (email_is_valid(email)){

    // show loader
    document.getElementById("password_loader").style.display = "inline-block";

    // disable form
    document.getElementById("forgot_password_email_input").disabled = true;
    document.getElementById("forgot_password_submit_button").disabled = true;

    $.ajax({

        url: "/request_password_reset_link/",
        type: "POST",
        data: {"email": email, "csrfmiddlewaretoken": get_csrf()},

        success: function(response){

          // hide loader
          document.getElementById("password_loader").style.display = "none";

          hide_bad_alert();
          set_message_good_alert("Please check your email for your temporary password reset link.");
          show_good_alert();
        },

        error: function(xhr, error_message, err){
          var response = xhr.responseJSON;

          // hide loader
          document.getElementById("password_loader").style.display = "none";

          // re-enable form
          document.getElementById("forgot_password_email_input").disabled = false;
          document.getElementById("forgot_password_submit_button").disabled = false;

          hide_good_alert();
          set_message_bad_alert(response);
          show_bad_alert();

        }

    });
  }
}
// =============================================================================



/*
  If the form is valid and complete, sends a request for the server to send
  an email to the user containing an account activation link.
*/
// =============================================================================
function account_activation_form_submitted(){
  // get email value
  var email = document.getElementById("activate_account_email_input").value;


  if (email_is_valid(email)){

    // show loader
    document.getElementById("activation_loader").style.display = "inline-block";

    // disable form
    document.getElementById("activate_account_email_input").disabled = true;
    document.getElementById("activate_account_submit_button").disabled = true;

    $.ajax({

        url: "/request_account_activation_link/",
        type: "POST",
        data: {"email": email, "csrfmiddlewaretoken": get_csrf()},

        success: function(response){

          // hide loader
          document.getElementById("activation_loader").style.display = "none";

          hide_bad_alert();
          set_message_good_alert("Please check your email for your temporary account activation link.");
          show_good_alert();
        },

        error: function(xhr, error_message, err){
          var response = xhr.responseJSON;

          // hide loader
          document.getElementById("activation_loader").style.display = "none";

          // re-enable form
          document.getElementById("activate_account_email_input").disabled = false;
          document.getElementById("activate_account_submit_button").disabled = false;

          hide_good_alert();
          set_message_bad_alert(response);
          show_bad_alert();

        }

    });
  }
}
// =============================================================================
