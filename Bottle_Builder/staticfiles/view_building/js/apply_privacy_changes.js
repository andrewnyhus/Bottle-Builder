

/*
  Returns whether the privacy changes data is valid.
  If invalid, tells the console why not.
*/
// =============================================================================
function validate_privacy_changes(privacy_changes){

  // if building pk is not set, return false
  if(!privacy_changes["building_pk"]){
    console.log("no building_pk, privacy_changes:");
    console.log(privacy_changes);

    return false;
  }

  // if "is_visible_to_public" is not in privacy changes, or is invalid,
  // return false
  if (!(privacy_changes["is_visible_to_public"] != undefined &&
      (privacy_changes["is_visible_to_public"] == "true" || privacy_changes["is_visible_to_public"] == "false"))){
        console.log("no is_visible_to_public, privacy_changes:");
        console.log(privacy_changes);
        return false;
  }


  // if "is_visible_to_members" is not in privacy changes, or is invalid,
  // return false
  if (!(privacy_changes["is_visible_to_members"] != undefined &&
      (privacy_changes["is_visible_to_members"] == "true" || privacy_changes["is_visible_to_members"] == "false"))){
        console.log("no is_visible_to_members, privacy_changes:" + privacy_changes);
        return false;
  }

  // if "is_visible_to_link" is not in privacy changes, or is invalid,
  // return false
  if (!(privacy_changes["is_visible_to_link"] != undefined &&
      (privacy_changes["is_visible_to_link"] == "true" || privacy_changes["is_visible_to_link"] == "false"))){
        console.log("no is_visible_to_link, privacy_changes:" + privacy_changes);
        return false;
  }

  return true;

}
// =============================================================================



/*
  Populates the privacy changes dictionary and passes it into post_privacy_changes.
*/
// =============================================================================
function apply_privacy_changes(){
  // put together dictionary
  privacy_changes = {};

  // include building pk
  privacy_changes["building_pk"] = get_building_pk().toString();

  // include public visibility
  if(document.getElementById("set_visible_to_public").checked){
    privacy_changes["is_visible_to_public"] = true.toString();
  }else{
    privacy_changes["is_visible_to_public"] = false.toString();
  }

  // include member visibility
  if(document.getElementById("set_visible_to_members").checked){
    privacy_changes["is_visible_to_members"] = true.toString();
  }else{
    privacy_changes["is_visible_to_members"] = false.toString();
  }

  // include link visibility
  if(document.getElementById("set_visible_to_those_with_link").checked){
    privacy_changes["is_visible_to_link"] = true.toString();
  }else{
    privacy_changes["is_visible_to_link"] = false.toString();
  }

  // post dictionary
  post_privacy_changes(privacy_changes);

}
// =============================================================================



/*
  Submits building privacy change request to server if the data is valid.
  If the data is not valid, displays an error message.
  If the request is successful, informs user in an alert, disables apply changes button.
  Otherwise, informs user that the request failed in an alert.
*/
// =============================================================================
function post_privacy_changes(privacy_changes){

  // if privacy changes are valid, submit the post request
  if(validate_privacy_changes(privacy_changes)){
      var data_string = JSON.stringify(privacy_changes)

      // disable apply changes button & radio buttons
      document.getElementById("apply_changes_button").disabled = true;
      document.getElementById("set_visible_to_public").disabled = true;
      document.getElementById("set_invisible_to_public").disabled = true;
      document.getElementById("set_visible_to_members").disabled = true;
      document.getElementById("set_invisible_to_members").disabled = true;
      document.getElementById("set_visible_to_those_with_link").disabled = true;
      document.getElementById("set_invisible_to_those_with_link").disabled = true;

      // show popover loader
      document.getElementById("popover_loader").style.display = "inline-block";

      // submit post request
      $.ajax({
        url: "/post_building_privacy_changes/",
        type: "POST",
        data: {"csrfmiddlewaretoken":get_token(), "data_string": data_string},
        success: function(response){

          // hide popover loader
          document.getElementById("popover_loader").style.display = "none";

          // enable radio buttons
          document.getElementById("set_visible_to_public").disabled = false;
          document.getElementById("set_invisible_to_public").disabled = false;
          document.getElementById("set_visible_to_members").disabled = false;
          document.getElementById("set_invisible_to_members").disabled = false;
          document.getElementById("set_visible_to_those_with_link").disabled = false;
          document.getElementById("set_invisible_to_those_with_link").disabled = false;

          // close popover
          close_popover();

          // delete toggle
          document.getElementById("building_popover").remove();


          hide_bad_alert();
          set_message_good_alert(response);
          show_good_alert();

        },
        error: function(xhr, error_message, err){
          var response = xhr.responseJSON;

          // enable apply changes button & radio buttons
          document.getElementById("apply_changes_button").disabled = false;
          document.getElementById("set_visible_to_public").disabled = false;
          document.getElementById("set_invisible_to_public").disabled = false;
          document.getElementById("set_visible_to_members").disabled = false;
          document.getElementById("set_invisible_to_members").disabled = false;
          document.getElementById("set_visible_to_those_with_link").disabled = false;
          document.getElementById("set_invisible_to_those_with_link").disabled = false;

          // hide popover loader
          document.getElementById("popover_loader").style.display = "none";

          hide_good_alert();
          set_message_bad_alert(response);
          show_bad_alert();

        }

      });

  }else{
    set_message_bad_alert("Unexpected error, did not apply privacy changes");
    show_bad_alert();
  }

}
// =============================================================================
