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
    .done(Training.create)
    .fail(function(jqXhrObject) { // handle a failure
      var errorsArray = jqXhrObject.responseJSON.errors
      var errorsString = errorsArray.join() // array elements are automatically comma-separated
      alert(errorsString)
    })
  })
}
// json parameter below = JSON object representation of AR training instance that was just created and saved to DB = successful JSON response I got back from AJAX POST request sent in Training.createListener()
Training.create = function(json) {
  var newTraining = new Training(json)
  newTraining.formatFitnessType()
}