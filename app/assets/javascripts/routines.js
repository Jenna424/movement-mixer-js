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