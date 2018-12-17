$(function() {
  checkIfTemplatesExist()
})

function checkIfTemplatesExist() {
  // The following variables store TRUE or FALSE (Self-Reminder: 0 is a falsy value in JS)
  const routineTemplateExists = $('#routine-template').length
  const techniqueTemplateExists = $('#technique-template').length
  const listMovementTemplateExists = $('#list-movement-template').length
  const guideTemplateExists = $('#guide-template').length
  const showMovementTemplateExists = $('#show-movement-template').length
  const mrTemplateExists = $('#mr-template').length
  const editMovementRoutineTemplateExists = $('#edit-movement-routine-template').length
  const editEquipmentRoutineTemplateExists = $('#edit-equipment-routine-template').length
  const erTemplateExists = $('#er-template').length
  const targetTemplateExists = $('#target-template').length
  const trainingTemplateExists = $('#training-template').length

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

  if (showMovementTemplateExists) {
    Movement.compileShowMovementTemplate()
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