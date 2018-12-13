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
    $('input[type=text]').val('') // empty the text_field where trainer typed in fitness_type
    $.post('/trainings', formData)
      .done(Training.create)
      .fail(Training.testValidity)
  })
}
// Below, trainingObject parameter = JSON object representation of AR training instance that was just created and saved to DB = successful JSON response to AJAX POST request sent using $.post() method in Training.createListener()
Training.create = function(trainingObject) {
  let newTraining = new Training(trainingObject)
  newTraining.featureFitnessType()
}

Training.prototype.featureFitnessType = function() {
  if (trainingTypesListIsVisible()) {
    this.formatLi()
    this.showAlertForFilledUl()
  } else {
    this.showAlertForEmptyUl()
  }
}

const trainingTypesListIsVisible = () => {
  if ($('ul#training-types-list p').length || $('ul#training-types-list li').length) {
    return true
  } else {
    return false
  }
}

Training.prototype.formatLi = function() {
  let $trainingTypesList = $('ul#training-types-list')
  if ($('ul#training-types-list p').length) { // <p>No fitness training types are recorded.</p> is displayed inside ul#training-types-list
    $trainingTypesList.html(Training.trainingTemplateFunction(this)) // replace the <p> with an <li> for the newTraining object just created
  } else { // ul#training-types-list contains an <li> for each existing training type
    $trainingTypesList.append(Training.trainingTemplateFunction(this)) // append an <li> for the newTraining object to the list of existing training type <li>s
  }
}

Training.prototype.showAlertForFilledUl = function() {
  $('div#message-container').html(
    `<div class="alert alert-success" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">x</span>
      </button>
      You successfully recorded the fitness training type ${this.fitness_type}!
    </div>`
  )
}

Training.prototype.showAlertForEmptyUl = function() {
  $('div#message-container').html(
    `<div class="alert alert-success" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">x</span>
      </button>
      <h4 class="alert-heading">You successfully recorded a new training type!</h4>
      <p>Clients can now design workout routines that implement the training type: <strong>${this.fitness_type}</strong></p>
      <hr>
      <p class="mb-0">Click the link at the bottom of the page to find this featured fitness type!</p>
    </div>`
  )
}
// a.view-training-types is always found in app/views/trainings/new.html.erb (so that a trainer can view the list of existing training types before adding a new one)
Training.indexListener = function() {
  $('a.view-training-types').on('click', function(e) {
    e.preventDefault()
    $.get('/trainings')
      .done(Training.index)
  })
}
// Below, trainingsArray parameter = JSON array of training objects = successful response I get back from AJAX GET request sent using $.get() in Training.indexListener()
Training.index = function(trainingsArray) {
  let $trainingTypesList = $('ul#training-types-list')
  trainingsArray.forEach(function(trainingObject) {
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