$(function() {
  checkIfTemplatesExist()
})

function checkIfTemplatesExist() {
  // The following variables store TRUE or FALSE (Self-Reminder: 0 is a falsy value in JS)
  var routineTemplateExists = $('#routine-template').length
  var userWorkoutsTemplateExists = $('#user-workouts-template').length
  var techniqueTemplateExists = $('#technique-template').length
  var listWorkoutTemplateExists = $('#list-workout-template').length
  var listExerciseTemplateExists = $('#list-exercise-template').length
  var trainingGuideTemplateExists = $('#training-guide-template').length
  var showExerciseTemplateExists = $('#show-exercise-template').length

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

  if (trainingGuideTemplateExists) {
    Guide.compileGuideTemplate()
    console.log("Compiled the Training Guide Template")
  }

  if (showExerciseTemplateExists) {
    Movement.compileShowExerciseTemplate()
    console.log("Compiled the Show Exercise Template")
  }
}