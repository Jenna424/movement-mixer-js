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
      .done(function(response) {
        var newMr = new MovementRoutine(response)
        var mrId = newMr.id
        $(`div#mr-${mrId}-data`).remove()
      })
    } else {
      console.log("User did not confirm exercise deletion.")
    }
  })
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