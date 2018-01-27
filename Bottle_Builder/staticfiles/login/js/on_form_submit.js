
/*
  Returns whether the form is valid and complete,
  also displays an alert if not.
*/
// =============================================================================
function form_input_is_valid(){

    if(!username_length_is_valid()){ return false; }

    if(!username_contains_only_valid_characters()){ return false; }

    if(!password_length_is_valid()){ return false; }

    hide_bad_alert();
    return true;

}
// =============================================================================



/*
  When the document is ready, set an onsubmit handler for the login form,
  to submit a login request if the form is valid.
  If the request is successful, redirect to the home page.
*/
// =============================================================================
$(function(){
    $("#login_form").submit(function(e){

        if(form_input_is_valid()){
            var post_data = { username: $("#username").val(), password: $("#password").val(), csrfmiddlewaretoken: get_csrf() };


            $.ajax({

                url: "/login/",
                type: "POST",
                data: post_data,

                success: function(response){
                  hide_bad_alert();
                  set_message_good_alert(response);
                  show_good_alert();

                  document.location = "/";
                },

                error: function(xhr, error_message, err){
                  var response = xhr.responseJSON;

                  hide_good_alert();
                  set_message_bad_alert(response);
                  show_bad_alert();
                }

            });
        }
        e.preventDefault();
    });
});
// =============================================================================
