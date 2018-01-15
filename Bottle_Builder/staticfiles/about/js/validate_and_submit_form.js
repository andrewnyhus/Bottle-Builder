function form_is_valid(){
  var feedback = document.getElementById("feedback_input").value;

  // if feedback is empty, indicate so, return false
  if (feedback == ""){
    // update label
    document.getElementById("feedback_input_label").innerHTML = "You left the feedback form empty. Please enter your feedback (1000 characters remaining)";
    return false;
  }

  // if feedback exceeds 1000 characters, indicate so, return false
  if (feedback.length > 1000){
    // update label
    document.getElementById("feedback_input_label").innerHTML = "Your feedback exceeds 1000 characters";
    return true;
  }

  return true;
}

function submit_form(){
  // disable form
  document.getElementById("feedback_button").disabled = true;
  document.getElementById("feedback_input").disabled = true;

  // if form is valid, then send the feedback
  if (form_is_valid()){

    // send feedback
    $.ajax({
      url: "/submit_feedback/",
      type: "POST",
      data: {"feedback": document.getElementById("feedback_input").value, csrfmiddlewaretoken: get_token()},
      success: function(response){

        // update the label to indicate that the form has been submitted
        document.getElementById("feedback_input_label").innerHTML = "Your feedback has been submitted! Thank you.";
      },
      error: function(xhr, error_message, err){
        // get and print error
        var response = xhr.responseJSON;
        console.log(response);

        // tell user that the feedback did not get submitted
        document.getElementById("feedback_input_label").innerHTML = "Sorry, there was an error submitting your feedback. Please try again.";

        // re-enable form
        document.getElementById("feedback_button").disabled = false;
        document.getElementById("feedback_input").disabled = false;

      }
    });

  }

}
