function Training(training) {
  this.id = training.id
  this.fitness_type = training.fitness_type
}

$(function() {
  Training.createListener()
})

Training.createListener = function() {
  $('.new_training').on('submit', function(e) {
  	e.preventDefault()
  	console.log("hijacked submit action of form to create new training type")
  })
}