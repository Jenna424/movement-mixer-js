function Routine(routine) {
  this.id = routine.id
  this.title = routine.title
  this.difficulty_level = routine.difficulty_level
  this.duration = routine.duration
  this.movements = routine.movements
  this.movement_routines = routine.movement_routines // to access technique, sets and reps on join model
  this.equipment = routine.equipment
  this.equipment_routines = routine.equipment_routines // to access weight and quantity on join model
  this.targets = routine.targets
  this.trainings = routine.trainings
  this.user = routine.user
}

$(function() {
  Routine.compileTemplates()
  Routine.bindClickEventHandlers()
})

Routine.compileTemplates = function() {
  // Routine Handlebars Template (found in app/views/routines/new.html.erb)
  Routine.routineTemplateSource = $('#routine-template').html();
  Routine.routineTemplateFunction = Handlebars.compile(Routine.routineTemplateSource);
  // Movement Handlebars Template (found in app/views/routines/_movement_fields.html.erb)
  Routine.movementTemplateSource = $('#movement-template').html();
  Routine.movementTemplateFunction = Handlebars.compile(Routine.movementTemplateSource);
  // Equipment Handlebars Template (found in app/views/routines/_equipment_fields.html.erb)
  Routine.equipmentTemplateSource = $('#equipment-template').html();
  Routine.equipmentTemplateFunction = Handlebars.compile(Routine.equipmentTemplateSource);
  // Target Handlebars Template (found in app/views/routines/_target_fields.html.erb)
  Routine.targetTemplateSource = $('#target-template').html();
  Routine.targetTemplateFunction = Handlebars.compile(Routine.targetTemplateSource);
  // Training Handlebars Template (found in app/views/routines/_training_fields.html.erb)
  Routine.trainingTemplateSource = $('#training-template').html();
  Routine.trainingTemplateFunction = Handlebars.compile(Routine.trainingTemplateSource);
}

Routine.bindClickEventHandlers = function() {
  Routine.addMovementHandler()
  Routine.addEquipmentHandler()
  Routine.addTargetAreaHandler()
  Routine.addTrainingTypeHandler()
}

Routine.addMovementHandler = function() {
  $('#add-movement').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    var inputs = $("[name^='routine[movements_attributes]']")
    var lastInput = inputs.last()
    var lastId = lastInput.attr("id")
    var idParts = lastInput.attr("id").split("_")
    var idNumber = idParts[3]
    var newIdNumber = parseInt(idParts[3]) + 1
    var movementHtmlFields = Routine.movementTemplateFunction({id: newIdNumber})
    $('#add-movement').before(movementHtmlFields)
  })
}
// User clicks <button id="add-movement"> to add another movement in the form to create a new workout routine
// I hijack the click event of that button by binding a new click event to it
// Stop the default behavior
// Stop event propagation
// The variable inputs stores an array of <input> fields to create a movement,
// whose name attribute value begins with the string "routine[movements_attributes]"
// which are the fields that I need to reproduce to add another movement to the routine
// Get the last <input> to eventually grab its id
// An id looks something like: "routine_movements_attributes_0_movement_routines_reps"
// Splitting this id string at the underscore: ["routine", "movements", "attributes", "0", "movement", "routines", "reps"]
// The element at index 3 is the id number!
