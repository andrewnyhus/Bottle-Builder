
// Help on this page from Kevin's answer at: https://stackoverflow.com/questions/8614947/jquery-and-django-csrf-token

/*
  Uses jQuery to retrieve the cookie
*/
// =============================================================================
function getCookie(name) {
    var cookieValue = null;

    // if cookies exist
    if (document.cookie && document.cookie !== '') {

        // split the cookies into an array
        var cookies = document.cookie.split(';');

        // iterate through the cookies, trim them and see if the current
        // cookie string is the correct one
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
// =============================================================================



// extracts csrftoken to be used in the ajax setup
var csrftoken = getCookie('csrftoken');



/*
  Returns whether the given method requires CSRF protection.
*/
// =============================================================================
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
// =============================================================================



/*
  If the method needs CSRF protection and the request is not cross domain,
  attach the csrftoken to the request header before sending the request.
*/
// =============================================================================
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});
// =============================================================================
