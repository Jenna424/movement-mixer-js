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

$(() => {
  Routine.bindEventListeners()
})

Routine.bindEventListeners = function() {
  Routine.addFieldsInCreateForm()
  Routine.createListener()
  Routine.addExerciseToExistingWorkout()
  Routine.addEquipmentToExistingWorkout()
  Routine.indexListener()
  Routine.destroyListener()
}
// The function below is called when the user clicks either the #add-movement or #add-equipment button in the form to create a new workout routine
Routine.addFieldsInCreateForm = function() {
  $('button[id^=add]').on('click', function(e) {
    e.preventDefault()
    let associatedObjects = $(this).data('add-association') // either "movements" or "equipment"
    let templateFn = Routine.movementsTemplateFunction
    if (associatedObjects === 'equipment') {
      templateFn = Routine.equipmentTemplateFunction
    }
    let fieldsToReplicate = $(`[name^='routine[${associatedObjects}_attributes]']`)
    let lastInput = fieldsToReplicate.last() // the last <input> pertaining to either movements or equipment, e.g., input#routine_movements_attributes_0_movement_routines_reps or input#routine_equipment_attributes_0_equipment_routines_weight
    let lastId = lastInput.attr('id') // e.g. "routine_movements_attributes_0_movement_routines_reps" or "routine_equipment_attributes_0_equipment_routines_weight"
    let idParts = lastId.split('_') // e.g. ["routine", "movements", "attributes", "0", "movement", "routines", "reps"] or ["routine", "equipment", "attributes", "0", "equipment", "routines", "weight"]
    let newIndexPosition = parseInt(idParts[3]) + 1
    let associatedObjectFields = templateFn({indexPosition: `${newIndexPosition}`})
    $(this).before(`${associatedObjectFields}<br>`)
  })
}

Routine.createListener = function() {
  $('form#new_routine').on('submit', function(e) {
    e.preventDefault()
    let createFormData = $(this).serialize()
    $.post('/routines', createFormData)
      .done(Routine.createWorkout)
      .fail(Routine.revealErrors)
  })
}
// Below, routineResponse parameter = JSON object representation of AR routine instance that was just created and saved to DB = successful JSON response I get back from AJAX POST request sent using $.post() method in Routine.createListener()
Routine.createWorkout = function(routineResponse) {
  Routine.emptyCreateForm() // empty the form once I get back a successful JSON response so that a user can create another new routine if she wants to. (The form is NOT emptied if I get back a failed response, so the user does NOT have to retype every form field if there are validation errors)
  let newRoutine = new Routine(routineResponse)
  newRoutine.formatAndPresentPreview()
  newRoutine.alertPreviewProduced()
}

Routine.emptyCreateForm = function() {
  $('#new_routine').find('input[type=text], textarea, input[type=number]').val(''); // empty the textfields, textareas and numberfields in <form id="new_routine">, in case the user wants to create another routine
  $('#new_routine').find('input[type=checkbox]').prop('checked', false) // uncheck any previously checked checkboxes for target areas and training types
}
// Below, this refers to the newRoutine object on which I'm calling prototype method formatAndPresentPreview()
Routine.prototype.formatAndPresentPreview = function() {
  $('div#preview-routine').html(Routine.routineTemplateFunction(this))
}

Routine.compileCreateTemplates = function() {
  // script#routine-template contains Handlebars template used to generate preview of newly-created workout routine
  Routine.routineTemplateSource = $('#routine-template').html();
  Routine.routineTemplateFunction = Handlebars.compile(Routine.routineTemplateSource);
  // Handlebars template used to add an exercise movement to a workout routine that's currently being designed
  Routine.movementsTemplateSource = $('#movements-template').html();
  Routine.movementsTemplateFunction = Handlebars.compile(Routine.movementsTemplateSource);
  // Handlebars template used to add a piece of equipment to a workout routine that's currently being designed
  Routine.equipmentTemplateSource = $('#equipment-template').html();
  Routine.equipmentTemplateFunction = Handlebars.compile(Routine.equipmentTemplateSource);
}
// Below, this refers to the newRoutine object on which I'm calling prototype method alertPreviewProduced()
Routine.prototype.alertPreviewProduced = function() {
  $('div#message-container').html(
    `<div class="alert alert-success" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
      Your workout routine, entitled <em>${this.title}</em>, was successfully created! You may preview your routine below:
    </div>`
  )
  document.getElementById('message-container').scrollIntoView()
}

Routine.revealErrors = function(jqXhrObject) {
  if (jqXhrObject.responseJSON && jqXhrObject.responseJSON.errors.length) {
    let validationErrorsArray = jqXhrObject.responseJSON.errors
    let formattedErrorsArray = validationErrorsArray.map(function(errorString) {
      let firstTwoWords = errorString.split(' ').slice(0, 2).join(' ')
      if (firstTwoWords === 'Movement routines' || firstTwoWords === 'Equipment routines') {
        return errorString.split(' ').splice(2).join(' ').replace(/^\w/, character => character.toUpperCase())
      } else if (firstTwoWords === 'Target ids') {
        return 'At least one target area must be selected'
      } else if (firstTwoWords === 'Training ids') {
        return 'At least one training type must be selected'
      } else {
        return errorString
      }
    })
    let formattedErrorsString = formattedErrorsArray.join('\n') // join array elements (string validation error messages) with a line break
    alert(`Your attempt to design a workout routine was unsuccessful:\n\n${formattedErrorsString}`)
  } else {
    console.error(`Your workout was not created due to the following error: ${jqXhrObject.statusText} (status code ${jqXhrObject.status})`)
  }
}

Routine.addExerciseToExistingWorkout = function() {
  $('form.add-exercise-form').on('submit', function(e) {
    e.preventDefault()
    let action = $(this).attr('action') // '/routines/:id'
    let formData = $(this).serialize()
    let movementName = $(this).find('input[type=text]').val()
    let technique = $(this).find('textarea').val()
    let sets = $(this).find('input[id$=movement_routines_sets]').val()
    let reps = $(this).find('input[id$=movement_routines_reps]').val()
    $(this).find('input[type=text], textarea, input[type=number]').val('') // empty textfield for movement name, textarea for MR technique, numberfields for MR sets & MR reps
    if (MovementRoutine.isValidObject(movementName, technique, sets, reps)) {
      $.ajax({
        url: action, // '/routines/:id'
        method: 'PATCH',
        dataType: 'json',
        data: formData
      })
        .done(MovementRoutine.addMovementToRoutine)
        .fail(handleError)
    }
  })
}

Routine.addEquipmentToExistingWorkout = function() {
  $('form.add-equipment-form').on('submit', function(e) {
    e.preventDefault()
    let equipmentName = $(this).find('input[type=text]').val()
    let action = $(this).attr('action') // "/routines/:id"
    let formData = $(this).serialize()
    let quantity = $(this).find('input[id$=equipment_routines_quantity]').val()
    let weight = $(this).find('input[id$=equipment_routines_weight]').val()
    $(this).find('input[type=text], input[type=number]').val('')
    if (EquipmentRoutine.isValidObject(equipmentName, quantity, weight)) {
      $.ajax({
        url: action,
        method: 'PATCH',
        dataType: 'json',
        data: formData
      })
        .done(EquipmentRoutine.addEquipmentToRoutine)
        .fail(handleError)
    }
  })
}
// a.index-routines is always found in the navigation, whether the logged-in user is unassigned/client/trainer/admin. Only viewers who have NOT registered/users who are NOT logged in will NOT view this link in the navbar.
Routine.indexListener = function() {
  $('a.index-routines').on('click', function(e) {
    e.preventDefault();
    history.pushState(null, null, "/routines")
    fetch('/routines')
      .then(response => response.json())
      .then(Routine.indexWorkouts)
      .catch(error => console.error('The Index of Workout Routines was not retrieved due to the following error:\n', error));
  })
}
// routinesArray parameter below = JSON object representation of AR::Relation of all routine instances
Routine.indexWorkouts = function(routinesArray) {
  let $divContainer = $('div.container')
  if (routinesArray.length) { // truthy if length is > 0, i.e., the Index of Workout Routines is NOT empty
    $divContainer.html('<h4>Index of Workout Routines</h4><br>')
    routinesArray.forEach(function(routineObject) {
      let newRoutine = new Routine(routineObject)
      let routineHtml = newRoutine.formatForIndex()
      $divContainer.append(routineHtml)
    })
  } else { // routinesArray.length === 0, a falsy value in JavaScript
    $divContainer.html(
      `<div class="alert alert-warning" role="alert">
        The Index of Workout Routines is currently empty.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">×</span>
        </button>
      </div>`
    )
  }
}

Routine.prototype.formatForIndex = function() {
  return Routine.listWorkoutTemplateFunction(this)
}

Routine.compileListWorkoutTemplate = function() {
  Routine.listWorkoutTemplateSource = $('#list-workout-template').html()
  Routine.listWorkoutTemplateFunction = Handlebars.compile(Routine.listWorkoutTemplateSource)
}

Routine.destroyListener = function() {
  $('button.delete-workout').parent().on('submit', function(e) {
    e.preventDefault()
    if (confirm('Are you sure you want to delete this workout routine?')) {
      $.ajax({
        url: $(this).attr('action'), // "/routines/:id"
        method: 'DELETE',
        dataType: 'json',
        data: $(this).serialize()
      })
        .done(Routine.destroy)
        .fail(handleError)
    }
  })
}
// Below, routineResponse parameter = JSON object representation of AR routine instance that was just destroyed = response to AJAX DELETE request sent in Routine.destroyListener()
Routine.destroy = function(routineResponse) {
  let newRoutine = new Routine(routineResponse)
  $('div.container').html("<div id='message-container'></div>")
  history.pushState(null, null, '/')
  newRoutine.appendDeleteAlert()
}

Routine.prototype.appendDeleteAlert = function() {
  $('div#message-container').html(
    `<div class="alert alert-success" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">×</span>
      </button>
      <h4 class="alert-heading">The workout routine entitled <em>${this.title}</em> was successfully deleted.</h4>
      <p>We hope you'll design another workout routine soon, ${this.user.name}!</p>
    </div>`
  )
}