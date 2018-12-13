const Training = (training) => {
  this.id = training.id
  this.fitness_type = training.fitness_type
}

const bindEventListeners = () => {
  Training.createListener()
  Training.indexListener()
  Training.destroyListener()
}

Training.createListener = function() {
  $('form#new_training').on('submit', function(e) {
  	e.preventDefault()
  	let formData = $(this).serialize()
  	$('input[type=text]').val('') // empty text_field where trainer enters value for fitness_type
  	$.post('/trainings', formData)
  	  .done(Training.create)
  	  .fail(Training.testValidity)
  })
}