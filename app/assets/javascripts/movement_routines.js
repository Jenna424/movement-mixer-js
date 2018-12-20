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
    $('div#exercise-errors-explanation').html(
      `<div class="alert alert-danger" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
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

$(() => {
  MovementRoutine.bindEventListeners()
})

MovementRoutine.bindEventListeners = function() {
  MovementRoutine.editListener()
  MovementRoutine.cancelEditListener()
  MovementRoutine.updateListener()
  MovementRoutine.destroyListener()
  MovementRoutine.showTechniqueListener()
  MovementRoutine.hideTechniqueListener()
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

MovementRoutine.compileEditMovementRoutineTemplate = function() {
  MovementRoutine.editMovementRoutineTemplateSource = $('#edit-movement-routine-template').html()
  MovementRoutine.editMovementRoutineTemplateFunction = Handlebars.compile(MovementRoutine.editMovementRoutineTemplateSource)
}
// <input type="button"> elements have no default behavior
MovementRoutine.cancelEditListener = function() {
  $('div.panel-body').on('click', 'input.cancel-editing-mr', function() {
    let id = $(this).data('id')
    let $editFormContainer = $(`#edit-mr-${id}-div`)
    let $editLink = $(`a[href='/mrs/${id}/edit']`)
    $editFormContainer.html('')
    $editFormContainer.removeClass('well well-md')
    $editLink.show()
  })
}

MovementRoutine.updateListener = function() {
  $('div.panel-body').on('submit', 'form.edit-mr', function(e) {
    e.preventDefault()
    let action = $(this).attr('action') // "/mrs/:id", which maps to routines#update_movement_routine
    let formData = $(this).serialize()
    $(this).find('textarea, input[type=number]').val(''); // empty the textarea & number_fields in the form to edit technique, sets & reps
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
  let $editFormContainer = $(`#edit-mr-${newMr.id}-div`)
  let $editLink = $(`a[href='/mrs/${newMr.id}/edit']`)
  $editFormContainer.html('') // Now that the MovementRoutine instance is successfully updated, empty the <div> that contains the edit form so that the edit form is no longer displayed
  $editFormContainer.removeClass('well well-md')
  $editLink.show()
  newMr.formatSetsAndReps()
  manyToManyModificationMessage(newMr) // this function is declared in shared.js
}

MovementRoutine.destroyListener = function() {
  $('div.panel-body').on('submit', 'form.button_to', function(e) {
    e.preventDefault()
    if (confirm('Are you sure you want to remove this exercise?')) {
      $.ajax({
        url: $(this).attr('action'), // '/mrs/:id', which maps to routines#destroy_movement_routine
        method: 'DELETE',
        dataType: 'json',
        data: $(this).serialize()
      })
        .done(MovementRoutine.destroy)
        .fail(handleError)
    }
  })
}
// Below, mrJson parameter = JSON object representation of the A.R. MovementRoutine instance that was just destroyed = successful JSON response I get back from AJAX DELETE request sent in MovementRoutine.destroyListener()
MovementRoutine.destroy = function(mrJson) {
  let newMr = new MovementRoutine(mrJson)
  newMr.deleteDiv()
  newMr.alertDeletionSuccessful()
}
// Below, this refers to the newMr object on which I'm calling prototype method .deleteDiv()
MovementRoutine.prototype.deleteDiv = function() {
  let id = this.id
  let $divToDelete = $(`#mr-${id}-div`)
  let $divTopBorder = $(`#hr-${id}`)
  $divToDelete.remove()
  if ($divTopBorder) { // if not null nor undefined
    $divTopBorder.remove()
  }
}
// Below, this refers to the newMr object on which I'm calling prototype method .alertDeletionSuccessful()
MovementRoutine.prototype.alertDeletionSuccessful = function() {
  $('div#message-container').html(
    `<div class="alert alert-success" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
      ${this.movement.name} will no longer be performed in this workout routine.
    </div>`
  )
  document.getElementById('message-container').scrollIntoView()
}

MovementRoutine.showTechniqueListener = function() {
  $('div.panel-body').on('click', '.js-show-technique', function() {
    let $showTechniqueButton = $(this) // stores the Show Technique button that was clicked, which has a data-id attribute value = id of MovementRoutine instance whose technique we want to see
    let id = $showTechniqueButton.data('id')
    $showTechniqueButton.hide()
    $.get(`/mrs/${id}`) // get '/mrs/:id' => 'movements#show_technique'
      .done(MovementRoutine.showTechnique)
      .fail(handleError)
  })
}
// Below, mrJson parameter = JSON object representation of A.R. MovementRoutine instance whose technique we want to see = successful JSON response I get back from AJAX GET request sent in MovementRoutine.showTechniqueListener()
MovementRoutine.showTechnique = function(mrJson) {
  let newMr = new MovementRoutine(mrJson)
  let id = newMr.id
  let $techniqueDiv = $(`#mr-${id}-technique-div`)
  $techniqueDiv.html(newMr.formatTechnique())
  $techniqueDiv.addClass('well well-md')
}
// Below, this refers to the newMr object on which I'm calling prototype method .formatTechnique()
MovementRoutine.prototype.formatTechnique = function() {
  return MovementRoutine.techniqueTemplateFunction(this)
}

MovementRoutine.compileTechniqueTemplate = function() {
  MovementRoutine.techniqueTemplateSource = $('#technique-template').html()
  MovementRoutine.techniqueTemplateFunction = Handlebars.compile(MovementRoutine.techniqueTemplateSource)
}

MovementRoutine.hideTechniqueListener = function() {
  $('div.panel-body').on('click', '.js-hide-technique', function() {
    let id = $(this).data('id') // Hide Technique <button> clicked (this) has a data-id attribute value = id of the MovementRoutine instance whose technique I'm hiding
    let $techniqueDiv = $(`#mr-${id}-technique-div`) // this <div> contains the technique & Hide Technique <button>
    $techniqueDiv.html('') // The technique and Hide Technique <button> will disappear when the <div> is emptied
    $techniqueDiv.removeClass('well well-md')
    $(`button[data-id=${id}]`).show() // display the Show Technique button for the technique that was just hidden
  })
}

MovementRoutine.prototype.formatSetsAndReps = function() {
  let mrId = this.id
  let $setsParagraph = $(`#sets-paragraph-${mrId}`)
  let $repsParagraph = $(`#reps-paragraph-${mrId}`)
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