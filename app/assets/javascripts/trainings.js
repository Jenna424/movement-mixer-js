function Training(training) {
  this.id = training.id
  this.fitness_type = training.fitness_type
}

$(function() {
  Training.createListener()
  Training.indexListener()
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
// Below, this refers to the newTraining object on which I call .formatFitnessType() prototype method
Training.prototype.formatFitnessType = function() {
  var trainingTypeDiv = $('div#training-type-added')
  trainingTypeDiv.html(`<p>Movement Mixers can now design <strong>${this.fitness_type.toLowerCase()}</strong> workout routines!</p>`)
}

Training.preparePage = function() {
  $divContainer = $('div.container') // retrieve the <div class="container"> that holds the main page content
  $divContainer.html('') // empty out the <div class="container">
  $divContainer.html('<h3>Training Types Implemented by Clients</h3>') // add <h3> header to the page
  $divContainer.append('<ul class="training-types"></ul>') // add <ul> (where training types will be listed) to the page
}

Training.indexListener = function() {
  $('ul.nav').on('click', 'a.view-training-types', function(e) {
    e.preventDefault()
    Training.preparePage()
    $.get('/trainings')
    .done(Training.indexTrainingTypes)
  })
}
// trainingTypesArray parameter below is an array of JSON training objects = response from from AJAX GET request sent using $.get() in Training.indexListener()
Training.indexTrainingTypes = function(trainingTypesArray) {
  $trainingTypesList = $('ul.training-types')
  trainingTypesArray.forEach(function(trainingObject) {
    console.log(trainingObject)
  })
}