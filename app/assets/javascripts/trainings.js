const Training = (training) => {
  this.id = training.id
  this.fitness_type = training.fitness_type
}

const bindEventListeners = () => {
  Training.createListener()
}

Training.createListener = function() {
  $('#new_training').on('submit', function(e) {
  	e.preventDefault()
  	$('ul#training-types-list').html('')
  	let formData = $(this).serialize()
  	$('input[type=text]').val('') // empty text_field where trainer typed in fitness_type
  	$.post('/trainings', formData)
  	  .done(Training.create)
  	  .fail(Training.testValidity)
  })
}