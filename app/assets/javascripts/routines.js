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

Routine.compileCreateTemplates = function() {
  // Handlebars template used to generate preview of newly-created workout routine
  Routine.routineTemplateSource = $('#routine-template').html();
  Routine.routineTemplateFunction = Handlebars.compile(Routine.routineTemplateSource);
  // Handlebars template used to add an exercise movement to a workout routine that's currently being designed
  Routine.movementsTemplateSource = $('#movements-template').html();
  Routine.movementsTemplateFunction = Handlebars.compile(Routine.movementsTemplateSource);
  // Handlebars template used to add a piece of equipment to a workout routine that's currently being designed
  Routine.equipmentTemplateSource = $('#equipment-template').html();
  Routine.equipmentTemplateFunction = Handlebars.compile(Routine.equipmentTemplateSource);
}

$(function() {
  Routine.bindEventListeners()
})

Routine.bindEventListeners = function() {
  Routine.addAssociationInCreateForm()
  Routine.createListener()
  Routine.addExerciseToExistingWorkout()
  Routine.addEquipmentToExistingWorkout()
  Routine.indexListener()
  Routine.destroyListener()
}
// The function below is called when the user clicks either the +Exercise or +Equipment button in the form to create a new workout routine
Routine.addAssociationInCreateForm = function() {
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
    let idParts = lastInput.attr('id').split('_') // e.g. ["routine", "movements", "attributes", "0", "movement", "routines", "reps"] or ["routine", "equipment", "attributes", "0", "equipment", "routines", "weight"]
    let newIndexPosition = parseInt(idParts[3]) + 1
    let associatedObjectFields = templateFn({indexPosition: `${newIndexPosition}`})
    $(this).before(`${associatedObjectFields}<br>`)
  })
}

Routine.createListener = function() {
  $('#new_routine').on('submit', function(e) {
    e.preventDefault()
    let createFormData = $(this).serialize()
    $.post('/routines', createFormData)
    .done(Routine.createWorkout)
    .fail(Routine.revealErrors)
  })
}
// Below, routineResponse parameter = JSON object representation of AR routine instance that was just created = JSON response I get back from AJAX POST request sent in Routine.createListener()
Routine.createWorkout = function(routineResponse) {
  Routine.preparePreviewPage()
  let newRoutine = new Routine(routineResponse)
  newRoutine.formatAndPresentPreview()
}

Routine.preparePreviewPage = function() {
  $('div#message-container').html(
    `<div class="alert alert-success" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
       <span aria-hidden="true">&times;</span>
      </button>
      Your workout routine was successfully created! You may preview your routine below:
    </div>`
  )
  $('#new_routine').find('input[type=text], textarea, input[type=number]').val(''); // empty the textfields, textareas and numberfields in <form id="new_routine">, in case the user wants to create another routine
  $('#new_routine').find('input[type=checkbox]').prop('checked', false) // uncheck any previously checked checkboxes for target areas and training types
}
// Below, this refers to the newRoutine object on which we're calling the formatAndAppendPreview() prototype method
Routine.prototype.formatAndPresentPreview = function() {
  $('div#preview-routine').append(Routine.routineTemplateFunction(this))
  document.getElementById('preview-routine').scrollIntoView()
}

Routine.revealErrors = function(jqXhrObject) {
  if (jqXhrObject.responseJSON) { // If NOT undefined, there are validation errors
    let validationErrorsArray = jqXhrObject.responseJSON.errors
    let formattedErrorsArray = validationErrorsArray.map(function(errorString) {
      let firstTwoWords = errorString.split(' ').slice(0, 2).join(' ')
      if (firstTwoWords === 'Movement routines' || firstTwoWords === 'Equipment routines') {
        return errorString.split(' ').splice(2).join(' ').replace(/^\w/, character => character.toUpperCase())
      } else if (firstTwoWords === 'Target ids') {
        return errorString.replace('ids', 'areas')
      } else if (firstTwoWords === 'Training ids') {
        return errorString.replace('ids', 'types')
      } else {
        return errorString
      }
    })
    let formattedErrorsString = formattedErrorsArray.join('\n') // join array elements (string validation error messages) with a line break
    alert(`Your attempt to design a workout routine was unsuccessful:\n\n${formattedErrorsString}`)
  } else {
    console.error(`Your workout was not created because an error occurred: ${jqXhrObject.statusText} (status code ${jqXhrObject.status})`)
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
// The link to View All Workouts is found in the navbar, which changes depending on if the viewer is logged in
Routine.indexListener = function() {
  $('ul.nav').on('click', 'a.all-routines', function(e) {
    e.preventDefault();
    history.replaceState(null, null, "/routines")
    $('div.container').html('') // empty <div class="container"> so that I can replace its content with the Index of Workout Routines
    fetch('/routines.json')
      .then(response => response.json())
      .then(Routine.indexWorkouts)
      .catch(error => console.error('The Index of Workout Routines was not retrieved because an error was detected:\n', error));
  })
}
// routinesArray parameter below = JSON object representation of AR::Relation of all routine instances
Routine.indexWorkouts = function(routinesArray) {
  if (routinesArray.length) { // truthy if length is > 0 (The Index of Workout Routines is NOT empty)
    $('div.container').html('<h4>Index of Workout Routines</h4><br>')
    routinesArray.forEach(function(routineObject) {
      let newRoutine = new Routine(routineObject);
      let routineHtml = newRoutine.formatForIndex()
      $('div.container').append(routineHtml)
    })
  } else { // routinesArray.length === 0 (0 is falsy in JavaScript)
    $('div.container').html(`
      <div class="alert alert-warning" role="alert">
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
  $("button.delete-workout").parent().on('submit', function(e) {
    e.preventDefault()
    if (confirm('Are you sure you want to delete this workout routine?')) {
      $.ajax({
        url: $(this).attr('action'), // "/routines/:id"
        method: 'delete',
        dataType: 'json',
        data: $(this).serialize()
      })
      .done(Routine.destroy)
    } else {
      console.log('Deletion of the workout routine was not confirmed.')
    }
  })
}
// Below, routineResponse parameter = JSON object representation of AR routine instance that was just destroyed = response to AJAX DELETE request sent in Routine.destroyListener()
Routine.destroy = function(routineResponse) {
  $('div.container').html('') // empty <div class="container"> that contains the show page of the routine that was just deleted
  var newRoutine = new Routine(routineResponse)
  newRoutine.presentDeleteNoticeParagraph()
}

Routine.prototype.presentDeleteNoticeParagraph = function() {
  $('div.container').append(
    `<p>The workout routine entitled <em>${this.title}</em> was successfully deleted from Movement Mixer.</p>
    <p>We hope you'll design another workout routine soon, ${this.user.name}!</p>`
  )
}