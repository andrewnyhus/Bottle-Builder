
function hide_buttons(){
  document.getElementById("forgot_username_button").style.display = "none";
  document.getElementById("forgot_password_button").style.display = "none";
  document.getElementById("activate_account_button").style.display = "none";

}


function show_username_form(){
  hide_buttons();
  document.getElementById("forgot_username_form").style.display = "block";
}

function show_password_form(){
  hide_buttons();
  document.getElementById("forgot_password_form").style.display = "block";
}

function show_activation_form(){
  hide_buttons();
  document.getElementById("activate_account_form").style.display = "block";
}
