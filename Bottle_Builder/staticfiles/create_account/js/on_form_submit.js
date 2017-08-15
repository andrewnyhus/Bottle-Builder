


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
            var post_data = {email: $("#email").val(), username: $("#username").val(), password: $("#password").val() };


            $.ajax({

                url: "/register/",
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

                    console.log("response:");
                    console.log(response);

                    hide_good_alert();
                    set_message_bad_alert(error_message);
                    show_bad_alert();
                }

            });
        }
        e.preventDefault();
    });


});



