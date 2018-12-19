function MovementRoutine(movementRoutine) {
  this.id = movementRoutine.id
  this.movement = movementRoutine.movement
  this.routine = movementRoutine.routine
  this.technique = movementRoutine.technique
  this.sets = movementRoutine.sets
  this.reps = movementRoutine.reps
}

MovementRoutine.isValidObject = function(movementName, technique, sets, reps) {
  if (!movementName.trim().length || !technique.trim().length || !(parseInt(sets) > 0) || !(parseInt(reps) > 0)) {
    $('div#add-exercise-errors').html(
      `<div class="alert alert-danger" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">×</span>
        </button>
        <h4 class="alert-heading">Your attempt to add an exercise to the workout was unsuccessful.</h4>
        <br>
        <strong>Please provide the following information</strong>:
        <ul>
          <li>Name of the exercise movement</li>
          <li>Technique for performing the exercise</li>
          <li>Number of sets (must be greater than 0)</li>
          <li>Number of reps (must be greater than 0)</li>
        </ul>
        <hr>
        <small class="mb-0"><em>Please note: exercise details will be overwritten if duplicate data is submitted.</em></small>
      </div>`
    )
    return false
  } else {
    return true
  }
}

$(function() {
  MovementRoutine.bindEventListeners()
})

MovementRoutine.bindEventListeners = function() {
  MovementRoutine.editListener()
  MovementRoutine.updateListener()
  MovementRoutine.cancelEditListener()
  MovementRoutine.destroyListener()
  MovementRoutine.showTechniqueListener()
  MovementRoutine.hideTechniqueListener()
}

MovementRoutine.compileEditMovementRoutineTemplate = function() {
  MovementRoutine.editMovementRoutineTemplateSource = $('#edit-movement-routine-template').html()
  MovementRoutine.editMovementRoutineTemplateFunction = Handlebars.compile(MovementRoutine.editMovementRoutineTemplateSource)
}

MovementRoutine.editListener = function() {
  $('div.panel-body').on('click', 'a.edit-mr', function(e) { // event delegation is necessary b/c movements are constantly being added/deleted on the routine show page
   e.preventDefault()
   $(this).hide() // hide <a class="edit-mr">Edit Exercise</a> link once it's been clicked
   let url = $(this).attr('href') // '/mrs/:id/edit'
   $.get(url)
     .done(MovementRoutine.displayEditForm)
     .fail(handleError)
  })
}
// Below, mrObject parameter = JSON object representation of AR MovementRoutine instance for which I'm displaying the edit form = successful JSON response I get back from AJAX GET request to '/mrs/:id/edit' sent in MovementRoutine.editListener(), which is triggered when user clicks Edit Exercise link on routine show page to edit technique/sets/reps user-submittable attributes stored in join table movement_routines
MovementRoutine.displayEditForm = function(mrObject) {
  let newMr = new MovementRoutine(mrObject)
  let $editFormContainer = $(`#edit-mr-${newMr.id}-div`)
  let editFormHtml = MovementRoutine.editMovementRoutineTemplateFunction(newMr)
  $editFormContainer.html(editFormHtml)
  $editFormContainer.addClass('well well-md')
}

MovementRoutine.updateListener = function() { // event delegation is necessary b/c movements are constantly being added/deleted on the routine show page
  $('div.panel-body').on('submit', 'form.edit-mr', function(e) {
    e.preventDefault()
    let action = $(this).attr('action') // "/mrs/:id"
    let id = action.split('/')[2] // stores the id of the MovementRoutine instance that's being updated
    let formData = $(this).serialize()
    $(this).hide() // hide the form once it's been submitted
    $(this).parent().removeClass('well well-md') // remove "well well-md" classes from div#edit-mr-MR ID GOES HERE-div
    $(`a[data-id=${id}]`).show() // show the Edit Exercise link on routine show page again
    $.ajax({
      url: action, // "/mrs/:id"
      method: 'PATCH',
      dataType: 'json',
      data: formData
    })
      .done(MovementRoutine.update)
      .fail(checkValidityOfJoinTableAttrs)
  })
}
// Below, mrJson parameter = JSON object representation of AR MovementRoutine instance that was just updated = successful JSON response I get back from AJAX PATCH request sent in MovementRoutine.updateListener()
MovementRoutine.update = function(mrJson) {
  let newMr = new MovementRoutine(mrJson)
  newMr.formatSetsAndReps()
}

MovementRoutine.cancelEditListener = function() {
  $(document).on('click', 'input.cancel-edit', function() {
    var mrId = $(this).data('mr-id')
    $(`form.edit-mr-${mrId}`).hide() // hide the edit form
    $(`a[data-mr-id=${mrId}]`).show() // display the Edit Exercise link
    $(`div#edit-mr-${mrId}-div`).removeClass('well well-lg') // remove "well well-lg" classes of the <div> that contained the edit form
  })
}

MovementRoutine.destroyListener = function() {
  $('div.panel-default').on('submit', 'form.button_to', function(e) {
    e.preventDefault()
    if (confirm('Are you sure you want to remove this exercise?')) {
      $.ajax({
        url: $(this).attr('action'), // delete '/mrs/:id' => 'routines#destroy_movement_routine'
        method: 'delete',
        dataType: 'json',
        data: $(this).serialize()
      })
      .done(MovementRoutine.destroy)
    }
  })
}

MovementRoutine.destroy = function(mrJson) { // mrJson parameter = JSON object representation of the A.R. MovementRoutine join model instance that was just destroyed = the JSON response I get back from AJAX DELETE request sent in MovementRoutine.destroyListener()
  var newMr = new MovementRoutine(mrJson)
  newMr.deleteDiv() // calling deleteDiv() prototype method on newMr object
}

MovementRoutine.prototype.deleteDiv = function() {
  var mrId = this.id // this refers to the newMr JSON object on which I'm calling prototype method .deleteDiv()
  $(`#mr-${mrId}-div`).remove()
}

MovementRoutine.compileTechniqueTemplate = function() {
  MovementRoutine.techniqueTemplateSource = $('#technique-template').html()
  MovementRoutine.techniqueTemplateFunction = Handlebars.compile(MovementRoutine.techniqueTemplateSource)
}

// On the routine show page, each movement in the collection of movements that comprise the routine
// has a Show Technique button
// When clicked, this button should add that movement's technique for that routine
// Technique is stored on the movement_routines join table

MovementRoutine.showTechniqueListener = function() {
  $('div.panel-default').on('click', '.js-show-technique', function() {
    var $showTechniqueButton = $(this); // $showTechniqueButton variable stores the Show Technique button that was clicked, which has a data-id property = id of MovementRoutine join table instance whose technique we want
    var mrId = $showTechniqueButton.data('id')
    $showTechniqueButton.hide()
    $.get(`/mrs/${mrId}`)
    .done(MovementRoutine.showTechnique)
  })
}
// Below, mrJson parameter = JSON object representation of AR MovementRoutine instance whose technique we want = response from AJAX GET request sent in MovementRoutine.showTechniqueListener()
MovementRoutine.showTechnique = function(mrJson) {
  var newMr = new MovementRoutine(mrJson)
  var mrId = newMr.id
  var $techniqueDiv = $(`#technique-div-${mrId}`)
  $techniqueDiv.html(newMr.formatTechnique()) // formatTechnique prototype method called on newMr object is defined below
  $techniqueDiv.addClass('well well-md')
}

MovementRoutine.hideTechniqueListener = function() {
  $('div.panel-default').on('click', '.js-hide-technique', function() {
    var mrId = $(this).data('hide-id') // Hide Technique <button class="js-hide-technique"> clicked (this) has a data-hide-id property that stores the id of the MovementRoutine instance whose technique I'm hiding
    var $techniqueDiv = $(`#technique-div-${mrId}`) // this <div> contains the technique & Hide Technique button
    $techniqueDiv.html('') // The technique and Hide Technique button will disappear when the <div> container is emptied
    $techniqueDiv.removeClass('well well-md')
    $(`button[data-id=${mrId}]`).show() // display the Show Technique button for the technique that was just hidden
  })
}

MovementRoutine.prototype.formatTechnique = function() {
  return MovementRoutine.techniqueTemplateFunction(this)
}

MovementRoutine.prototype.formatSetsAndReps = function() {
  var mrId = this.id
  var $setsParagraph = $(`#sets-paragraph-${mrId}`)
  var $repsParagraph = $(`#reps-paragraph-${mrId}`)
  $setsParagraph.html(`<strong>Sets</strong>: ${this.sets}`)
  $repsParagraph.html(`<strong>Reps</strong>: ${this.reps}`)
}

MovementRoutine.compileMrTemplate = function() {
  MovementRoutine.mrTemplateSource = $('#mr-template').html()
  MovementRoutine.mrTemplateFunction = Handlebars.compile(MovementRoutine.mrTemplateSource)
}

// The json parameter below is the JSON object representation of the MovementRoutine instance 
// (with data about the routine and movement instances to which it belongs). 
// This JSON object representation of the MovementRoutine instance = response to AJAX PATCH request made in Routine.addExerciseListener()
MovementRoutine.addMovementToRoutine = function(json) {
  var newMr = new MovementRoutine(json)
  var mrDivsArray = $("div[id^='mr']")
  var filteredDivArray = mrDivsArray.filter(function() {
    return this.id === `mr-${newMr.id}-div` // this refers to each <div> element in the mrDivsArray
  })
  var mrDivExists = filteredDivArray.length
  if (mrDivExists) { // Reminder: 0 is falsy in JavaScript
    newMr.formatSetsAndReps()
  } else {
    newMr.formatAndAppendDiv()
  }
  addAssociationAlert(newMr)
}

MovementRoutine.prototype.formatAndAppendDiv = function() {
  var workoutRoutineDiv = $('#workout-routine') // get the <div> that contains all the movements in the routine
  var mrDivHtml = MovementRoutine.mrTemplateFunction(this) // store the Handlebars template w/ values injected from key/value pairs in newMr object (this)
  workoutRoutineDiv.append(mrDivHtml) // appending the <div> for the new movement/MR to the div containing all movements in the routine 
}