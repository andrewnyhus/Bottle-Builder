

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

function apply_privacy_changes(pk){
  // put together dictionary
  privacy_changes = {};

  // include building pk
  privacy_changes["building_pk"] = pk.toString();

  // include public visibility
  if(document.getElementById("set_visible_to_public_"+pk).checked){
    privacy_changes["is_visible_to_public"] = true.toString();
  }else{
    privacy_changes["is_visible_to_public"] = false.toString();
  }

  // include member visibility
  if(document.getElementById("set_visible_to_members_"+pk).checked){
    privacy_changes["is_visible_to_members"] = true.toString();
  }else{
    privacy_changes["is_visible_to_members"] = false.toString();
  }

  // include link visibility
  if(document.getElementById("set_visible_to_those_with_link_"+pk).checked){
    privacy_changes["is_visible_to_link"] = true.toString();
  }else{
    privacy_changes["is_visible_to_link"] = false.toString();
  }

  // post dictionary
  post_privacy_changes(privacy_changes);

}


function post_privacy_changes(privacy_changes){

  // if privacy changes are valid, submit the post request
  if(validate_privacy_changes(privacy_changes)){
      var data_string = JSON.stringify(privacy_changes)


      // submit post request
      $.ajax({
        url: "/post_building_privacy_changes/",
        type: "POST",
        data: {"csrfmiddlewaretoken":get_token(), "data_string": data_string},
        success: function(response){
          hide_bad_alert();
          set_message_good_alert(response);
          show_good_alert();

          // update apply changes button
          document.getElementById('apply_changes_button_'+privacy_changes["building_pk"]).disabled = true;

        },
        error: function(xhr, error_message, err){
          var response = xhr.responseJSON;

          hide_good_alert();
          set_message_bad_alert(response);
          show_bad_alert();

        }

      });

  }else{
    console.log("Did not send, data was invalid");
  }

}
