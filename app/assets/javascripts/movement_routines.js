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