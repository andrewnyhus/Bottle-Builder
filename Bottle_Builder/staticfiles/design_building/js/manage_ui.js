/*
  Disables all form elements
*/
// =============================================================================
function disable_form_elements(){

  // disable title input if found in page
  if(document.getElementById("building_title_input") != null){
    document.getElementById("building_title_input").disabled = true;
  }

  // disable privacy checkboxes if found in page
  if(document.getElementById("visible_to_public_checkbox") != null &&
      document.getElementById("visible_to_members_checkbox") != null &&
      document.getElementById("visible_to_link_checkbox") != null){

      document.getElementById("visible_to_public_checkbox").disabled = true;
      document.getElementById("visible_to_members_checkbox").disabled = true;
      document.getElementById("visible_to_link_checkbox").disabled = true;

  }


  /* disable measurement system radios, building height, foundation depth,
    width between bottles, fill density dropdown, bottle volume,
    bottle diameter and bottle height inputs
  */
  document.getElementById("imperial_radio").disabled = true;
  document.getElementById("metric_radio").disabled = true;
  document.getElementById("building_height_input").disabled = true;
  document.getElementById("foundation_depth_input").disabled = true;
  document.getElementById("width_between_bottles_input").disabled = true;
  document.getElementById("bottle_fill_density_dropdown_button").disabled = true;
  document.getElementById("manual_entry_bottle_fill_density").disabled = true;
  document.getElementById("bottle_volume_input").disabled = true;
  document.getElementById("bottle_diameter_input").disabled = true;
  document.getElementById("bottle_height_input").disabled = true;

  // disable post button and in depth resource estimate button
  document.getElementById("generate_resource_estimate_button").disabled = true;
  document.getElementById("post_design_button").disabled = true;


}
// =============================================================================

/*
  Enables all form elements
*/
// =============================================================================
function enable_form_elements(){
  // enable title input if found in page
  if(document.getElementById("building_title_input") != null){
    document.getElementById("building_title_input").disabled = false;
  }

  // enable privacy checkboxes if found in page
  if(document.getElementById("visible_to_public_checkbox") != null &&
      document.getElementById("visible_to_members_checkbox") != null &&
      document.getElementById("visible_to_link_checkbox") != null){

      document.getElementById("visible_to_public_checkbox").disabled = false;
      document.getElementById("visible_to_members_checkbox").disabled = false;
      document.getElementById("visible_to_link_checkbox").disabled = false;

  }


  /* enable measurement system radios, building height, foundation depth,
    width between bottles, fill density dropdown, bottle volume,
    bottle diameter and bottle height inputs
  */
  document.getElementById("imperial_radio").disabled = false;
  document.getElementById("metric_radio").disabled = false;
  document.getElementById("building_height_input").disabled = false;
  document.getElementById("foundation_depth_input").disabled = false;
  document.getElementById("width_between_bottles_input").disabled = false;
  document.getElementById("bottle_fill_density_dropdown_button").disabled = false;
  document.getElementById("manual_entry_bottle_fill_density").disabled = false;
  document.getElementById("bottle_volume_input").disabled = false;
  document.getElementById("bottle_diameter_input").disabled = false;
  document.getElementById("bottle_height_input").disabled = false;

  // enable post button and in depth resource estimate button
  document.getElementById("generate_resource_estimate_button").disabled = false;
  document.getElementById("post_design_button").disabled = false;

}
// =============================================================================
