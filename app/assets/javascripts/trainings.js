function Training(training) {
  this.id = training.id
  this.fitness_type = training.fitness_type
}

$(() => {
  Training.createListener()
  Training.indexListener()
  Training.destroyListener()
})

Training.compileTrainingTemplate = function() {
  Training.trainingTemplateSource = $('#training-template').html()
  Training.trainingTemplateFunction = Handlebars.compile(Training.trainingTemplateSource)
}

Training.createListener = function() {
  $('form#new_training').on('submit', function(e) {
    e.preventDefault()
    let formData = $(this).serialize()
    $('input[type=text]').val('') // empty the text_field where trainer types in fitness_type
    $.post('/trainings', formData)
      .done(Training.create)
      .fail(Training.testValidity)
  })
}

// Below, trainingObject parameter = JSON object representation of newly created AR training instance = response I get back from AJAX POST request sent using $.post() in Training.createListener()
Training.create = function(trainingObject) {
  let newTraining = new Training(trainingObject)
  $('div#message-container').html(
    `<div class="alert alert-success" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">x</span>
      </button>
      <h4 class="alert-heading">You successfully created a new fitness training type!</h4>
      <p>Clients can now design <strong>${newTraining.fitness_type.toLowerCase()}</strong> workout routines.</p>
    </div>`
  )
  if ($('ul#training-types-list li').length) {
    $('ul#training-types-list').append(newTraining.formatLi())
  } else if ($('#no-training-types').length) {
  	$('#no-training-types').remove()
  	$('a.view-training-types').show()
  }
}

Training.prototype.formatLi = function() {
  return Training.trainingTemplateFunction(this)
}
// The link to View All Training Types is ALWAYS found in app/views/trainings/new.html.erb view file,
// so that the trainer can see a list of existing fitness training types before creating a new one.
Training.indexListener = function() {
  $('a.view-training-types').on('click', function(e) {
    $(this).hide()
    e.preventDefault() // prevent the default behavior of sending a normal HTTP GET request to "/trainings"
    fetch('/trainings')
      .then(response => response.json())
      .then(Training.index)
      .catch(error => console.error('The Index of Fitness Training Types could not be retrieved due to an error:\n', error))
  })
}
// ul#training-types-list is ALWAYS found in app/views/trainings/new.html.erb view file
// Below, trainingsArray parameter = JSON array of training objects = successful JSON response I get back from fetch('/trainings'), which is sent in Training.indexListener()
Training.index = function(trainingsArray) {
  let $trainingTypesList = $('ul#training-types-list')
  $trainingTypesList.html('') // empty ul#training-types-list
  if (trainingsArray.length) {
    $trainingTypesList.before('<h3 id="all-trainings-heading">All Fitness Training Types</h3>')
    trainingsArray.forEach(function(trainingObject) {
      let newTraining = new Training(trainingObject)
      $trainingTypesList.append(newTraining.formatLi())
    })
  } else {
    $trainingTypesList.before("<p id='no-training-types'><em>No fitness training types are recorded.</em></p>")
  }
}

Training.destroyListener = function() {
  $('ul#training-types-list').on('submit', 'form.delete-training-type', function(e) {
    e.preventDefault()
    if (confirm('Are you sure you want to delete this training type?')) {
      $.ajax({
        url: $(this).attr('action'), // '/trainings/:id'
        method: 'DELETE',
        dataType: 'json',
        data: $(this).serialize()
      })
        .done(Training.destroy)
        .fail(handleError)
    }
  })
}
// Below, trainingObject parameter = JSON object representation of the AR training instance that was just destroyed = successful JSON response I got back from AJAX DELETE request sent in Training.destroyListener()
Training.destroy = function(trainingObject) {
  let newTraining = new Training(trainingObject)
  newTraining.deleteLi()
  if ($('ul#training-types-list li').length === 0) { // After the training type is deleted, if there are NO <li>s for training types left in the ul#training-types-list
    $('h3#all-trainings-heading').remove()
  }
  newTraining.alertDeletionSuccessful()
}

Training.prototype.deleteLi = function() {
  $(`li#training-${this.id}`).remove()
}

Training.prototype.alertDeletionSuccessful = function() {
  $('div#message-container').html(
    `<div class="alert alert-success" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">x</span>
      </button>
      <h4 class="alert-heading">You successfully deleted a training type.</h4>
      <p>Workout routines will no longer employ the following fitness type: <strong>${this.fitness_type}</strong></p>
    </div>`
  )
}