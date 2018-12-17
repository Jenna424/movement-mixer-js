$(function() {
  checkIfTemplatesExist()
})

function checkIfTemplatesExist() {
  // The following variables store TRUE or FALSE (Self-Reminder: 0 is a falsy value in JS)
  var routineTemplateExists = $('#routine-template').length
  var techniqueTemplateExists = $('#technique-template').length
  var listMovementTemplateExists = $('#list-movement-template').length
  var guideTemplateExists = $('#guide-template').length
  var showExerciseTemplateExists = $('#show-exercise-template').length
  var mrTemplateExists = $('#mr-template').length
  var editMovementRoutineTemplateExists = $('#edit-movement-routine-template').length
  var editEquipmentRoutineTemplateExists = $('#edit-equipment-routine-template').length
  var erTemplateExists = $('#er-template').length
  var targetTemplateExists = $('#target-template').length
  var trainingTemplateExists = $('#training-template').length

  // Conditionally compile Handlebars templates, depending on if the Handlebars template is present in the current DOM
  if (routineTemplateExists) { // User creates a new workout routine at "/routines/new", where these HS templates are rendered
    Routine.compileCreateTemplates()
    console.log("Compiled Handlebars Templates for Routine Form")
  }

  if (listMovementTemplateExists) {
    Movement.compileListMovementTemplate()
  }

  if (guideTemplateExists) {
    Guide.compileGuideTemplate()
    console.log("Compiled the Training Guide Template")
  }

  if (showExerciseTemplateExists) {
    Movement.compileShowExerciseTemplate()
    console.log("Compiled the Show Exercise Template")
  }

  if (techniqueTemplateExists) {
    MovementRoutine.compileTechniqueTemplate()
  }

  if (mrTemplateExists) {
    MovementRoutine.compileMrTemplate()
  }

  if (editMovementRoutineTemplateExists) {
    MovementRoutine.compileEditMovementRoutineTemplate()
  }

  if (editEquipmentRoutineTemplateExists) {
    EquipmentRoutine.compileEditEquipmentRoutineTemplate()
  }

  if (erTemplateExists) {
    EquipmentRoutine.compileErTemplate()
  }

  if (targetTemplateExists) {
    Target.compileTargetTemplate()
  }

  if (trainingTemplateExists) {
    Training.compileTrainingTemplate()
  }
}