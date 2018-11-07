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
//= require rails-ujs
//= require jquery
//= require bootstrap
//= require activestorage
//= require_tree .

$(function() {
  checkIfTemplatesExist()
})

function checkIfTemplatesExist() {
  // The following variables store TRUE or FALSE (Self-Reminder: 0 is a falsy value in JS)
  var routineTemplateExists = $('#routine-template').length
  var userWorkoutsTemplateExists = $('#user-workouts-template').length
  var techniqueTemplateExists = $('#technique-template').length
  var listWorkoutTemplateExists = $('#list-workout-template').length // <script id="list-workout-template"> is found in _navbar.html.erb file
  var listExerciseTemplateExists = $('#list-exercise-template').length // <script id="list-exercise-template"> is found in _navbar.html.erb file
  // Conditionally compile Handlebars templates, depending on if the Handlebars template is present in the current DOM
  if (routineTemplateExists) { // User creates a new workout routine at "/routines/new", where these HS templates are rendered
    Routine.compileTemplates()
    console.log("Compiled Handlebars Templates for Routine Form")
  } else if (userWorkoutsTemplateExists) { // Currently on user show page, where link is clicked to view that user's workout routines
    User.compileUserWorkoutsTemplate()
    console.log("Compiled the User Workouts Handlebars Template!")
  } else if (techniqueTemplateExists) { // User is on the routine show page
    Routine.compileTechniqueTemplate()
    console.log("Compiled the Technique Template!")
  } else {
    console.log("The current DOM page only contains the 2 Handlebars templates found in _navbar partial.")
  }

  if (listExerciseTemplateExists) {
    Movement.compileListExerciseTemplate()
    console.log("Compiled the List Exercise Template found in _navbar partial!")
  }

  if (listWorkoutTemplateExists) {
    Routine.compileListWorkoutTemplate()
    console.log("Compiled the List Workout Template found in _navbar partial!")
  }
}