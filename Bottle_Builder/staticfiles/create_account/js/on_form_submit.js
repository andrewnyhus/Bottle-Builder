


// returns false & displays an alert if any form input is invalid
// otherwise returns true
// DOES NOT CHECK WITH SERVER IF DATA IS VALID
function form_input_is_valid(){

    if(!email_length_is_valid()){ return false; }

    if(!username_length_is_valid()){ return false; }

    if(!username_contains_only_valid_characters()){ return false; }

    if(!password_length_is_valid()){ return false; }

    if(!passwords_are_equal()){ return false; }

    hide_bad_alert();
    return true;

}



$(function(){
    $("#create_account_form").submit(function(e){

        if(form_input_is_valid()){

            // disable form
            document.getElementById("email").disabled = true;
            document.getElementById("username").disabled = true;
            document.getElementById("password").disabled = true;
            document.getElementById("confirm_password").disabled = true;
            document.getElementById("submit_button").disabled = true;

            // show loader
            document.getElementById("submit_loader").style.display = "inline-block";

            var post_data = {email: $("#email").val(), username: $("#username").val(), password: $("#password").val(), csrfmiddlewaretoken: get_token()};


            $.ajax({

                url: "/register/",
                type: "POST",
                data: post_data,

                success: function(response){

                  // hide loader
                  document.getElementById("submit_loader").style.display = "none";

                  hide_bad_alert();
                  set_message_good_alert(response);
                  show_good_alert();

                },

                error: function(xhr, error_message, err){
                  var response = xhr.responseJSON;

                  // re-enable form
                  document.getElementById("email").disabled = false;
                  document.getElementById("username").disabled = false;
                  document.getElementById("password").disabled = false;
                  document.getElementById("confirm_password").disabled = false;
                  document.getElementById("submit_button").disabled = false;

                  // hide loader
                  document.getElementById("submit_loader").style.display = "none";

                  hide_good_alert();
                  set_message_bad_alert(response);
                  show_bad_alert();
                }

            });
        }
        e.preventDefault();
    });


});
