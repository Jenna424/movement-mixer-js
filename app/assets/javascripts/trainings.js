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
  $('form#new_training').on('submit', function(e) {
    e.preventDefault()
    let formData = $(this).serialize()
    $('input[type=text]').val('') // empty the text_field where trainer types in fitness_type
    $.post('/trainings', formData)
      .done(Training.create)
      .fail(Training.testValidity)
  })
}
// Below, trainingObject parameter = JSON object representation of newly created A.R. training instance = successful JSON response I get back from AJAX POST request sent in Training.createListener()
Training.create = function(trainingObject) {
  if ($('ul#training-types-list li').length === 0 && $('p#no-training-types').length === 0) { // If there are currently NO <li> elements inside ul#training-types-list AND p#no-training-types is NOT present on the current page,
    $('a.view-training-types').show() // now that a new training type exists, ensure that the link to View All Training Types is visible so I'll be able to click it to view the new <li>
  }
  let newTraining = new Training(trainingObject)
  newTraining.showIfIndexLinkClicked()
  newTraining.alertCreationSuccessful()
}
// Below, this refers to the newTraining object on which I'm calling prototype method .showIfIndexLinkClicked()
Training.prototype.showIfIndexLinkClicked = function() {
  if ($('ul#training-types-list li').length || $('p#no-training-types').length) { // If the user clicked the View All Training Types link prior to creating a new training type, ul#training-types-list contains an <li> for each existing training type, OR the page has <p id="no-training-types"> if none exists (i.e. the collection is empty)
    $('ul#training-types-list').append(this.formatLi()) // append the <li> for the new training type just created to ul#training-types-list
    if ($('ul#training-types-list li').length === 1) { // the training type <li> just added is the only one inside ul#training-types-list
      $('ul#training-types-list').before("<h3 id='all-training-types'>All Fitness Training Types</h3>")
    }
  }
  if ($('p#no-training-types').length) { // The user clicked the View All Training Types link prior to creating a new training type, but the collection was empty at that time, so p#no-training-types was displayed
    $('p#no-training-types').remove() // Now that a new training type has been created and the collection is no longer empty, remove p#no-training-types
  }
}
// Below, this refers to the newTraining object (this in showIfIndexLinkClicked) on which I'm now calling prototype method .formatLi()
Training.prototype.formatLi = function() {
  return Training.trainingTemplateFunction(this)
}

Training.compileTrainingTemplate = function() {
  Training.trainingTemplateSource = $('#training-template').html()
  Training.trainingTemplateFunction = Handlebars.compile(Training.trainingTemplateSource)
}
// Below, this refers to the newTraining object on which I'm calling prototype method .alertCreationSuccessful()
Training.prototype.alertCreationSuccessful = function() {
  $('div#message-container').html(
    `<div class="alert alert-success" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
      <h4 class="alert-heading">You successfully created a new fitness training type!</h4>
      <p>
        Clients can now design ${this.fitness_type === this.fitness_type.toUpperCase() ? this.fitness_type : this.fitness_type.toLowerCase()} workout routines.
      </p>
    </div>`
  )
}

Training.testValidity = function(jqXhrObject) {
  if (jqXhrObject.responseJSON && jqXhrObject.responseJSON.errors.length) {
    let validationError = jqXhrObject.responseJSON.errors.pop()
    alert(`Your attempt to create a training type was unsuccessful:\n${validationError}`)
  } else {
    console.error(`Your attempt to create a training type was unsuccessful due to the following error: ${jqXhrObject.statusText} (status code ${jqXhrObject.status})`)
  }
}
// The link to View All Training Types is ALWAYS found in app/views/trainings/new.html.erb view file, so that the trainer can see a list of existing fitness training types before creating a new one.
Training.indexListener = function() {
  $('a.view-training-types').on('click', function(e) {
    e.preventDefault() // prevent the default behavior of sending a normal HTTP GET request to "/trainings"
    $(this).hide()
    let requestObject = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    }
    fetch('/trainings', requestObject)
      .then(response => response.json())
      .then(Training.index)
      .catch(error => console.error('Fitness training types could not be retrieved due to the following error:', error))
  })
}
// Below, trainingsArray parameter = JSON array of training objects = successful JSON response I get back from fetch('/trainings', requestObject), which is sent in Training.indexListener()
Training.index = function(trainingsArray) {
  let $trainingTypesList = $('ul#training-types-list') // ul#training-types-list is ALWAYS found in app/views/trainings/new.html.erb
  $trainingTypesList.html('') // empty ul#training-types-list in case it contains any stale training type <li>s
  if (trainingsArray.length) {
    $trainingTypesList.before("<h3 id='all-training-types'>All Fitness Training Types</h3>")
    trainingsArray.forEach(function(trainingObject) {
      let newTraining = new Training(trainingObject)
      $trainingTypesList.append(newTraining.formatLi())
    })
  } else {
    $trainingTypesList.before("<p id='no-training-types'><em>No fitness training types were found.</em></p>")
  }
}
// Below, event delegation is necessary because training type <li>s are constantly being added to/deleted from ul#training-types-list
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
// Below, trainingObject parameter = JSON object representation of the A.R. training instance that was just destroyed = successful JSON response I get back from AJAX DELETE request sent in Training.destroyListener()
Training.destroy = function(trainingObject) {
  let newTraining = new Training(trainingObject)
  newTraining.deleteLi()
  if ($('ul#training-types-list li').length === 0) { // After the training type <li> is deleted, if there are NO <li>s for training types left in the ul#training-types-list
    $('h3#all-training-types').remove()
  }
  newTraining.alertDeletionSuccessful()
}
// Below, this refers to the newTraining object on which I'm calling prototype method .deleteLi()
Training.prototype.deleteLi = function() {
  $(`li#training-${this.id}`).remove()
}
// Below, this refers to the newTraining object on which I'm calling prototype method .alertDeletionSuccessful()
Training.prototype.alertDeletionSuccessful = function() {
  $('div#message-container').html(
    `<div class="alert alert-success" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
      <h4 class="alert-heading">You successfully deleted a training type.</h4>
      <p>Workout routines will no longer employ the ${this.fitness_type === this.fitness_type.toUpperCase() ? this.fitness_type : this.fitness_type.toLowerCase()} training type.</p>
    </div>`
  )
}