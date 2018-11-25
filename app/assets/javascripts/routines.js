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
  Routine.bindEventHandlers()
})

Routine.compileTemplates = function() {
  // Routine Handlebars Template (found in app/views/routines/new.html.erb)
  Routine.routineTemplateSource = $('#routine-template').html();
  Routine.routineTemplateFunction = Handlebars.compile(Routine.routineTemplateSource);
  // Movement Handlebars Template (found in app/views/routines/_movement_fields.html.erb)
  Routine.movementsTemplateSource = $('#movements-template').html();
  Routine.movementsTemplateFunction = Handlebars.compile(Routine.movementsTemplateSource);
  // Equipment Handlebars Template (found in app/views/routines/_equipment_fields.html.erb)
  Routine.equipmentTemplateSource = $('#equipment-template').html();
  Routine.equipmentTemplateFunction = Handlebars.compile(Routine.equipmentTemplateSource);
}

Routine.compileTechniqueTemplate = function() {
  Routine.techniqueTemplateSource = $('#technique-template').html()
  Routine.techniqueTemplateFunction = Handlebars.compile(Routine.techniqueTemplateSource)
}

Routine.compileListWorkoutTemplate = function() {
  Routine.listWorkoutTemplateSource = $('#list-workout-template').html()
  Routine.listWorkoutTemplateFunction = Handlebars.compile(Routine.listWorkoutTemplateSource)
}

Routine.bindEventHandlers = function() {
  Routine.addAssociationHandler()
  Routine.createListener()
  Routine.addAssociationToExistingWorkout()
  Routine.handleWorkoutsIndex()
}

Routine.addAssociationHandler= function() {
  $("button[id^='add']").on('click', function(e) {
    e.preventDefault()
    e.stopPropagation()
    var association = $(this).data('add-association') // either "movements" or "equipment"
    var fieldsToReplicate = $(`[name^='routine[${association}_attributes]']`)
    var lastInput = fieldsToReplicate.last() // the last <input> pertaining to either movements or equipment, e.g., input#routine_movements_attributes_0_movement_routines_reps or input#routine_equipment_attributes_0_equipment_routines_weight
    var lastId = lastInput.attr('id') // e.g. "routine_movements_attributes_0_movement_routines_reps" or "routine_equipment_attributes_0_equipment_routines_weight"
    var idParts = lastInput.attr('id').split('_') // e.g. ["routine", "movements", "attributes", "0", "movement", "routines", "reps"] or ["routine", "equipment", "attributes", "0", "equipment", "routines", "weight"]
    var newIndexPosition = parseInt(idParts[3]) + 1
    var associationFieldsHtml = eval(`Routine.${association}TemplateFunction({indexPosition: ${newIndexPosition}})`)
    $(this).before(`${associationFieldsHtml}<br>`)
  })
}

Routine.createListener = function() {
  $('#new_routine').on('submit', function(e) {
    e.preventDefault()
    var createFormData = $(this).serialize()
    $.post('/routines', createFormData)
    .done(Routine.createWorkout)
    .fail(Routine.revealErrors)
  })
}
// Below, routineResponse parameter = JSON object representation of AR routine instance that was just created = JSON response I get back from AJAX POST request sent in Routine.createListener()
Routine.createWorkout = function(routineResponse) {
  Routine.preparePreviewPage()
  let newRoutine = new Routine(routineResponse)
  newRoutine.formatAndAppendPreview()
}

Routine.preparePreviewPage = function() {
  var $previewDiv = $('#preview-routine')
  $previewDiv.html('') // empty <div id="preview-routine">, where preview of newly created routine will be displayed
  $previewDiv.addClass('well well-md')
  $('#new_routine').find('input[type=text], textarea, input[type=number]').val(''); // empty the textfields, textareas and numberfields in <form id="new_routine">, in case the user wants to create another routine
  $('#new_routine').find('input[type=checkbox]').prop('checked', false) // uncheck any previously checked checkboxes for target areas and training types
}
// Below, this refers to the newRoutine object on which we're calling the formatAndAppendPreview() prototype method
Routine.prototype.formatAndAppendPreview = function() {
  $('#preview-routine').html(Routine.routineTemplateFunction(this))
}

Routine.revealErrors = function(jqXhrObject) {
  var errorsArray = jqXhrObject.responseJSON.errors
  var errorsString = errorsArray.join('\n') // join array elements (string error messages) with a line break
  alert(`Your attempt to edit this workout routine was unsuccessful:\n\n${errorsString}`)
}

// The link to View All Workouts is found in the navbar, which changes depending on if the viewer is logged in
Routine.handleWorkoutsIndex = function() {
  $('ul.nav').on('click', 'a.all-routines', function(e) {
    e.preventDefault();
    history.replaceState(null, null, "/routines")
    fetch(`/routines.json`)
      .then(response => response.json())
      .then(routinesArray => {
        $('div.container').html('') // clear out <div class="container"> in the <body> of the page (so I can replace its content with Index of Workout Routines below)
        $('div.container').append('<h4>Index of Workout Routines</h4><br>')
        routinesArray.forEach(function(routineObject) {
          let newRoutine = new Routine(routineObject);
          let routineHtml = newRoutine.formatForIndex()
          $('div.container').append(routineHtml)
        })
      })
    })
}

Routine.prototype.formatForIndex = function() {
  return Routine.listWorkoutTemplateFunction(this)
}

Routine.compileEditEquipmentTemplate = function() {
  Routine.editEquipmentTemplateSource = $('#edit-equipment-template').html()
  Routine.editEquipmentTemplateFunction = Handlebars.compile(Routine.editEquipmentTemplateSource)
}