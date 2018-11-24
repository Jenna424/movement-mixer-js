function MovementRoutine(movementRoutine) {
  this.id = movementRoutine.id
  this.movement = movementRoutine.movement
  this.routine = movementRoutine.routine
  this.technique = movementRoutine.technique
  this.sets = movementRoutine.sets
  this.reps = movementRoutine.reps
}

$(function() {
  MovementRoutine.bindEventListeners()
})

MovementRoutine.bindEventListeners = function() {
  MovementRoutine.destroyListener()
}

MovementRoutine.compileEditMovementRoutineTemplate = function() {
  MovementRoutine.editMovementRoutineTemplateSource = $('#edit-movement-routine-template').html()
  MovementRoutine.editMovementRoutineTemplateFunction = Handlebars.compile(MovementRoutine.editMovementRoutineTemplateSource)
}
// Below, mrJson parameter = JSON object representation of AR MovementRoutine instance that we're formatting the edit form for = the response from AJAX GET request to '/mrs/:id/edit' sent in Routine.editExerciseListener(), which is triggered when user clicks Edit Exercise on routine show page to edit technique/sets/reps user-submittable attributes stored on join model MovementRoutine
MovementRoutine.displayEditMrForm = function(mrJson) {
  let newMr = new MovementRoutine(mrJson)
  let $editMrDiv = $(`div#edit-mr-${newMr.id}-div`)
  let editMrFormHtml = MovementRoutine.editMovementRoutineTemplateFunction(newMr)
  $editMrDiv.html(editMrFormHtml)
  $editMrDiv.addClass('well well-md')
}
// Below, mrJson parameter = JSON object representation of AR MovementRoutine instance that was just updated = JSON response from AJAX PATCH request sent in Routine.updateExerciseListener()
MovementRoutine.update = function(mrJson) {
  var newMr = new MovementRoutine(mrJson)
  newMr.formatJoinTableAttrs()
}

MovementRoutine.revealErrors = function() {
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

MovementRoutine.prototype.formatTechnique = function() {
  return MovementRoutine.techniqueTemplateFunction(this)
}

MovementRoutine.prototype.formatJoinTableAttrs = function() {
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
    newMr.formatJoinTableAttrs()
  } else {
    newMr.formatAndAppendDiv()
  }
}

MovementRoutine.prototype.formatAndAppendDiv = function() {
  var workoutRoutineDiv = $('#workout-routine') // get the <div> that contains all the movements in the routine
  var mrDivHtml = MovementRoutine.mrTemplateFunction(this) // store the Handlebars template w/ values injected from key/value pairs in newMr object (this)
  workoutRoutineDiv.append(mrDivHtml) // appending the <div> for the new movement/MR to the div containing all movements in the routine 
}