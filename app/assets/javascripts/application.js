// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//

//= require jquery
//= require bootstrap
//= require activestorage
//= require templates
//= require_tree .

function fetchErrorHandler() {
  if (response.ok) { // In a successful response, we'll see ok: true
    return response;
  } else {
    throw Error(response.statusText); // example: used to print out error.message Not Found
  }
}
// Error response status codes (400s and 500s) will NOT automatically reject the promise returned by .fetch(),
// so I must raise an error to reject the promise and delegate error handling to .catch()