function Training(training) {
  this.id = training.id
  this.fitness_type = training.fitness_type
}

$(function() {
  Training.createListener()
})

Training.createListener = function() {
  $('#new_training').on('submit', function(e) {
    e.preventDefault()
    var formData = $(this).serialize()
    $.post('/trainings', formData)
    .done(function(response) {
      console.log(response) // handle a successful response here
    })
  })
}