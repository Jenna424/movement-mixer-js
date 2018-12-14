function Training(training) {
  this.id = training.id
  this.fitness_type = training.fitness_type
}

$(() => {
  Training.createListener()
  Training.indexListener()
  //Training.destroyListener()
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
      <h4 class="alert-heading">You successfully featured a new fitness training type!</h4>
      <p>Clients can now design workout routines that implement the training type: <strong>${newTraining.fitness_type}</strong>.</p>
      <hr>
      <p class="mb-0">You may view the updated list of training types by clicking the link at the bottom of this page.</p>
    </div>`
  )
  if ($('ul#training-types-list li').length) {
    $('ul#training-types-list').append(newTraining.formatLi())
  } else if ($('p').length) {
  	$('p').remove()
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
  if (trainingsArray.length) {
    $trainingTypesList.before('<h3>All Fitness Training Types</h3>')
    $trainingTypesList.html('<br>')
    trainingsArray.forEach(function(trainingObject) {
      let newTraining = new Training(trainingObject)
      $trainingTypesList.append(newTraining.formatLi())
    })
  } else {
    $trainingTypesList.before('<p><em>No fitness training types are recorded.</em></p>')
    $trainingTypesList.html('<br>')
  }
}