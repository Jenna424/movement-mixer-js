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

MovementRoutine.destroyListener = function() {
  $('div.panel-default').on('click', 'form.button_to', function(e) {
    e.preventDefault()
    if (confirm('Are you sure you want to remove this exercise?')) {
      $.ajax({
        url: $(this).attr('action'), // "/routines/:routine_id/movements/:movement_id" (maps to routines#destroy)
        method: 'delete',
        dataType: 'json',
        data: $(this).serialize()
      })
      .done(MovementRoutine.destroy)
    } else {
      console.log("User did not confirm exercise deletion.")
    }
  })
}

MovementRoutine.destroy = function(json) { // json parameter of MovementRoutine.destroy function = JSON object representation of the A.R. MovementRoutine join model instance that was just destroyed = the JSON response I get back from MovementRoutine.destroyListener()
  var newMr = new MovementRoutine(json)
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