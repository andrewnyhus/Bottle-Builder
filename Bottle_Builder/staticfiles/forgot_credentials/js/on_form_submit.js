// check if a given string is a valid email
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

  return true;
}



// validates and then sends forgotten username to users email
function forgot_username_form_submitted(){
  // get email value
  var email = document.getElementById("forgot_username_email_input").value;

  // disable form
  document.getElementById("forgot_username_email_input").disabled = true;
  document.getElementById("forgot_username_submit_button").disabled = true;


  if (email_is_valid(email)){
    $.ajax({

        url: "/forgot_username/",
        type: "POST",
        data: {"email": email},

        success: function(response){
          hide_bad_alert();
          set_message_good_alert("Please check your email for your username.");
          show_good_alert();
        },

        error: function(xhr, error_message, err){
          var response = xhr.responseJSON;

          hide_good_alert();
          set_message_bad_alert(response);
          show_bad_alert();

          // re-enable form
          document.getElementById("forgot_username_email_input").disabled = false;
          document.getElementById("forgot_username_submit_button").disabled = false;

        }

    });
  }
}



// validates and then sends password reset link to users email
function forgot_password_form_submitted(){
  // get email value
  var email = document.getElementById("forgot_password_email_input").value;

  // disable form
  document.getElementById("forgot_password_email_input").disabled = true;
  document.getElementById("forgot_password_submit_button").disabled = true;


  if (email_is_valid(email)){
    $.ajax({

        url: "/request_password_reset_link/",
        type: "POST",
        data: {"email": email},

        success: function(response){
          hide_bad_alert();
          set_message_good_alert("Please check your email for your temporary password reset link.");
          show_good_alert();
        },

        error: function(xhr, error_message, err){
          var response = xhr.responseJSON;

          hide_good_alert();
          set_message_bad_alert(response);
          show_bad_alert();

          // re-enable form
          document.getElementById("forgot_password_email_input").disabled = false;
          document.getElementById("forgot_password_submit_button").disabled = false;

        }

    });
  }
}



// validates and then sends account activation link to users email
function account_activation_form_submitted(){
  // get email value
  var email = document.getElementById("activate_account_email_input").value;

  // disable form
  document.getElementById("activate_account_email_input").disabled = true;
  document.getElementById("activate_account_submit_button").disabled = true;


  if (email_is_valid(email)){
    $.ajax({

        url: "/request_account_activation_link/",
        type: "POST",
        data: {"email": email},

        success: function(response){
          hide_bad_alert();
          set_message_good_alert("Please check your email for your temporary account activation link.");
          show_good_alert();
        },

        error: function(xhr, error_message, err){
          var response = xhr.responseJSON;

          hide_good_alert();
          set_message_bad_alert(response);
          show_bad_alert();

          // re-enable form
          document.getElementById("activate_account_email_input").disabled = false;
          document.getElementById("activate_account_submit_button").disabled = false;

        }

    });
  }
}
