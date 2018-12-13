function Training(training) {
  this.id = training.id
  this.fitness_type = training.fitness_type
}

$(() => {
  Training.createListener()
  Training.indexListener()
  Training.destroyListener()
})

Training.createListener = function() {
  $('#new_training').on('submit', function(e) {
    e.preventDefault()
    let formData = $(this).serialize()
    $.post('/trainings', formData)
      .done(Training.create)
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
  var $trainingTypesList = $('ul.training-types')
  trainingTypesArray.forEach(function(trainingObject) {
    $trainingTypesList.append(Training.trainingTemplateFunction(trainingObject))
  })
}

Training.compileTrainingTemplate = function() {
  Training.trainingTemplateSource = $('#training-template').html()
  Training.trainingTemplateFunction = Handlebars.compile(Training.trainingTemplateSource)
}

Training.destroyListener = function() {
  $('div.container').on('submit', 'form.delete-training-type', function(e) {
    e.preventDefault()
    if (confirm('Are you sure you want to delete this training type?')) {
      $.ajax({
        url: $(this).attr('action'), // '/trainings/:id'
        method: 'delete',
        dataType: 'json',
        data: $(this).serialize()
      })
      .done(Training.destroy)
    } else {
      console.log("Deletion of training type was not confirmed!")
    }
  })
}
// json parameter is the JSON object representation of the training AR instance that was just destroyed = response from the AJAX DELETE request that was sent in Training.destroyListener()
Training.destroy = function(json) {
  var newTraining = new Training(json)
  newTraining.deleteLi()
}
// Below, this refers to the newTraining object on which I call .deleteLi() prototype method
Training.prototype.deleteLi = function() {
  $(`li#training-${this.id}`).remove()
}