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
  Routine.movementTemplateSource = $('#movement-template').html();
  Routine.movementTemplateFunction = Handlebars.compile(Routine.movementTemplateSource);
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
  Routine.createListener()
  Routine.addMovementHandler()
  Routine.addEquipmentHandler()
  Routine.handleWorkoutsIndex()
  Routine.handleShowTechnique()
  Routine.handleHideTechnique()
  Routine.handleCancelEdit()
  Routine.addExerciseListener()
  Routine.addEquipmentListener()
}

Routine.addExerciseListener = function() {
  $('.add-exercise-form').on('submit', function(e) {
    e.preventDefault()
    $.ajax({
      url: $(this).attr('action'), // "/routines/:id"
      method: 'patch',
      dataType: 'json',
      data: $(this).serialize()
    })
    .done(MovementRoutine.addMovementToRoutine) // The response to AJAX PATCH request is the JSON object representation of the MovementRoutine instance (with data about the routine and movement instances to which it belongs)
    $('.add-exercise-form').find('input[type=text], textarea, input[type=number]').val(''); // clear the form
  })
}

Routine.addEquipmentListener = function() {
  $('.add-equipment-form').on('submit', function(e) {
    e.preventDefault()
    $.ajax({
      url: $(this).attr('action'), // "/routines/:id"
      method: 'patch',
      dataType: 'json',
      data: $(this).serialize()
    })
    .done(EquipmentRoutine.addEquipmentToRoutine)
    $('.add-equipment-form').find('input[type=text] input[type=number]').val('')
  })
}

Routine.addMovementHandler = function() {
  $('#add-movement').on('click', function(e) {
    e.preventDefault();
    console.log('hijacked the click event')
    //e.stopPropagation();
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

Routine.addEquipmentHandler = function() {
  $('#add-equipment').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    var equipmentFieldsToReplicate = $("[name^='routine[equipment_attributes']");
    var lastEquipmentInput = equipmentFieldsToReplicate.last(); // The last <input> pertaining to equipment
    var lastId = lastEquipmentInput.attr('id'); // lastId stores a string like "routine_equipment_attributes_0_equipment_routines_weight"
    var idParts = lastId.split("_"); // idParts stores array ["routine", "equipment", "attributes", "0", "equipment", "routines", "weight"]
    var lastIndexPosition = idParts[3]; // "0"
    var newIndexPosition = parseInt(lastIndexPosition) + 1;
    var equipmentHtmlFields = Routine.equipmentTemplateFunction({indexPosition: newIndexPosition})
    $('#add-equipment').before(equipmentHtmlFields)
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
// On the routine show page, each movement in the collection of movements that comprise the routine
// has a Show Technique button
// When clicked, this button should add that movement's technique for that routine
// Technique is stored on the movement_routines join table

Routine.handleShowTechnique = function() {
  $('div.panel-default').on('click', '.js-show-technique', function() {
    var $showTechniqueButton = $(this); // $showTechniqueButton stores the Show Technique button that was clicked, which has a data-id property = id of MovementRoutine join table instance whose technique we want
    var mrId = $showTechniqueButton.data('id')
    var $displayTechniqueDiv = $(`#display-technique-${mrId}`)
    $.get(`/mrs/${mrId}`)
    .done(function(response) {
      $showTechniqueButton.hide()
      let newMr = new MovementRoutine(response)
      let techniqueHtml = newMr.formatTechnique()
      $displayTechniqueDiv.html(techniqueHtml)
      $displayTechniqueDiv.addClass('well well-lg')
      //$displayTechniqueDiv.after(`<button class="js-hide-technique btn btn-default btn-sm" data-hide-id=${newMr.id}>Hide Technique</button>`)
    })
  })
}

Routine.handleHideTechnique = function() {
  $('div.panel-default').on('click', '.js-hide-technique', function(e) {
    var mrId = $(this).data('hide-id')
    var displayTechniqueDiv = $(`#display-technique-${mrId}`)
    displayTechniqueDiv.html('')
    displayTechniqueDiv.removeClass('well well-lg')
    $(this).hide()
    var showButton = $(`[data-id=${mrId}]`)
    showButton.show()
  })
}

Routine.handleCancelEdit = function() {
  $(document).on('click', 'input.cancel-edit', function() {
    var mrId = $(this).data('mr-id')
    $(`form.edit-mr-${mrId}`).hide()
    $(`a[data-mr-id=${mrId}]`).show()
    $(`div#edit-mr-${mrId}-div`).removeClass('well well-lg')
  })
}

Routine.compileEditEquipmentTemplate = function() {
  Routine.editEquipmentTemplateSource = $('#edit-equipment-template').html()
  Routine.editEquipmentTemplateFunction = Handlebars.compile(Routine.editEquipmentTemplateSource)
}