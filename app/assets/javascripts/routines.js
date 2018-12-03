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
  //Routine.addAssociationToExistingWorkout()
  Routine.indexListener()
  Routine.destroyListener()
}
// Routine.addAssociationInCreateForm() is called when user clicks +Exercise or +Equipment button in the form to create a new workout routine, found in app/views/routines/new.html.erb
Routine.addAssociationInCreateForm= function() {
  $("button[id^='add']").on('click', function(e) {
    e.preventDefault()
    e.stopPropagation()
    var association = $(this).data('add-association') // either "movements" or "equipment"
    var templateFn = Routine.movementsTemplateFunction
    if (association === 'equipment') {
      templateFn = Routine.equipmentTemplateFunction
    }
    var fieldsToReplicate = $(`[name^='routine[${association}_attributes]']`)
    var lastInput = fieldsToReplicate.last() // the last <input> pertaining to either movements or equipment, e.g., input#routine_movements_attributes_0_movement_routines_reps or input#routine_equipment_attributes_0_equipment_routines_weight
    var lastId = lastInput.attr('id') // e.g. "routine_movements_attributes_0_movement_routines_reps" or "routine_equipment_attributes_0_equipment_routines_weight"
    var idParts = lastInput.attr('id').split('_') // e.g. ["routine", "movements", "attributes", "0", "movement", "routines", "reps"] or ["routine", "equipment", "attributes", "0", "equipment", "routines", "weight"]
    var newIndexPosition = parseInt(idParts[3]) + 1
    var associationFieldsHtml = templateFn({indexPosition: `${newIndexPosition}`})
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
  var $previewDiv = $('div#preview-routine') // div#preview-routine is always present on routines/new.html.erb
  $previewDiv.html(`<div class=\'alert alert-success\' role=\'alert\'>Your workout routine was successfully created! You may preview your routine below:</div>`)
  $('#new_routine').find('input[type=text], textarea, input[type=number]').val(''); // empty the textfields, textareas and numberfields in <form id="new_routine">, in case the user wants to create another routine
  $('#new_routine').find('input[type=checkbox]').prop('checked', false) // uncheck any previously checked checkboxes for target areas and training types
}
// Below, this refers to the newRoutine object on which we're calling the formatAndAppendPreview() prototype method
Routine.prototype.formatAndAppendPreview = function() {
  $('div#preview-routine').append(Routine.routineTemplateFunction(this))
  document.getElementById('preview-routine').scrollIntoView()
}

Routine.revealErrors = function(jqXhrObject) {
  if (jqXhrObject.responseJSON) { // If NOT undefined, there are validation errors
    var validationErrorsArray = jqXhrObject.responseJSON.errors
    var validationErrorsString = validationErrorsArray.join('\n') // join array elements (string validation error messages) with a line break
    alert(`Your attempt to design a workout routine was unsuccessful:\n\n${validationErrorsString}`)
  } else {
    console.error("An error occurred:\nStatus Text:", jqXhrObject.statusText, "\nResponse Text:", jqXhrObject.responseText.substring(0, 40))
  }
}
// Explanation of Routine.addAssociationToExistingWorkout function below (which replaced Routine.addExerciseListener AND Routine.addEquipmentListener functions)
// On the Routine Show Page, the user can add an exercise movement to a workout routine by submitting form.add-exercise-form
// On the Routine Edit Page, the user can add a piece of equipment to a workout routine by submitting form.add-equipment-form
// Use jQuery to find these 2 forms whose class attribute values start with the word 'add'
// Hijack the submit event of the form to add a new exercise movement/piece of equipment to the existing workout
// and prevent the default submit action, which would be a normal PATCH request to "/routines/:id" (b/c I use fields_for due to many-to-many relationships)
// set variable successCallback = MovementRoutine.addMovementToRoutine
// $(this) = the form the user tried to submit = form.add-exercise-form or form.add-equipment-form
// $(this).attr('class') retrieves the class attribute value of the form: either "add-exercise-form" or "add-equipment-form"
// $(this).attr('class').split('-') returns either ["add", "exercise", "form"] or ["add", "equipment", "form"]
// $(this).attr('class').split('-')[1] returns either "exercise" or "equipment"
// Send AJAX PATCH request to "/routines/:id"
// pass successCallback, (which stores either MovementRoutine.addMovementToRoutine or EquipmentRoutine.addEquipmentToRoutine) to .done() to handle a successful response to AJAX PATCH request
// After form submission, empty textfield, textarea and numberfields in form.add-exercise-form/ empty textfield and numberfields in form.add-equipment-form
// CHANGES START HERE
//Routine.addAssociationToExistingWorkout = function() {
  //$("form[class^='add']").on('submit', function(e) {
    //e.preventDefault()
    //var successCallback = MovementRoutine.addMovementToRoutine
    //if ($(this).attr('class').split('-')[1] === 'equipment') {
      //successCallback = EquipmentRoutine.addEquipmentToRoutine
    //}
    //$.ajax({
      //url: $(this).attr('action'), // "/routines/:id"
      //method: 'patch',
      //dataType: 'json',
      //data: $(this).serialize()
    //})
    //.done(successCallback)
    //$(this).find('input[type=text], textarea, input[type=number]').val('');
  //})
//}
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
    $('div.container').append('<h4>Index of Workout Routines</h4><br>')
    routinesArray.forEach(function(routineObject) {
      let newRoutine = new Routine(routineObject);
      let routineHtml = newRoutine.formatForIndex()
      $('div.container').append(routineHtml)
    })
  } else { // routinesArray.length === 0 (0 is falsy in JavaScript)
    $('div.container').append('<p>The Index of Workout Routines is currently empty.</p>')
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