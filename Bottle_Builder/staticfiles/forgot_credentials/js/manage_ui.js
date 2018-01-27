/*
  Hides menu buttons
*/
// =============================================================================
function hide_buttons(){
  document.getElementById("forgot_username_button").style.display = "none";
  document.getElementById("forgot_password_button").style.display = "none";
  document.getElementById("activate_account_button").style.display = "none";
}
// =============================================================================



/*
  Shows menu buttons
*/
// =============================================================================
function show_buttons(){
  document.getElementById("forgot_username_button").style.display = "block";
  document.getElementById("forgot_password_button").style.display = "block";
  document.getElementById("activate_account_button").style.display = "block";
}
// =============================================================================



/*
  Prepares screen for user to request an email with their username
*/
// =============================================================================
function show_username_form(){
  hide_buttons();
  document.getElementById("forgot_username_form").style.display = "block";

  // show back button
  document.getElementById("back_button").style.display = "block";
}
// =============================================================================



/*
  Prepares screen for user to request an email with a password reset link
*/
// =============================================================================
function show_password_form(){
  hide_buttons();
  document.getElementById("forgot_password_form").style.display = "block";

  // show back button
  document.getElementById("back_button").style.display = "block";
}
// =============================================================================



/*
  Prepares screen for user to request an email with an account activation link
*/
// =============================================================================
function show_activation_form(){
  hide_buttons();
  document.getElementById("activate_account_form").style.display = "block";

  // show back button
  document.getElementById("back_button").style.display = "block";
}
// =============================================================================



/*
  Hides forms and shows menu buttons 
*/
// =============================================================================
function back_button_pressed(){

  // hide all forms
  document.getElementById("forgot_username_form").style.display = "none";
  document.getElementById("forgot_password_form").style.display = "none";
  document.getElementById("activate_account_form").style.display = "none";

  // hide back button
  document.getElementById("back_button").style.display = "none";

  show_buttons();

}
// =============================================================================
