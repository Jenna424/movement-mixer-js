function Movement(movement) {
	this.id = movement.id
	this.name = movement.name
	this.guides = movement.guides
	this.movement_routines = movement.movement_routines // to access user-submittable attributes (technique, sets, reps) stored in join table
	this.routines = movement.routines
}

$(() => {
	Movement.bindClickEventListeners()
})

Movement.bindClickEventListeners = function() {
  Movement.indexListener()
  Movement.showNextOrPreviousListener()
}
// The link to View All Exercises is ALWAYS found in the navigation on initial payload when the logged-in user is unassigned/client/trainer/admin
Movement.indexListener = function() {
  $('a.all-movements').on('click', function(e) {
    e.preventDefault()
    history.pushState(null, null, '/movements')
    let requestObject = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    }
    fetch('/movements', requestObject)
      .then(response => response.json())
      .then(Movement.indexExercises)
      .catch(error => console.error('The Index of Exercise Movements could not be retrieved due to an error:\n', error))
  })
}
// Below, movementsArray parameter = JSON array representation of AR::Relation of all movement instances = JSON response from fetch('/movements') call sent in Movement.indexListener()
Movement.indexExercises = function(movementsArray) {
  let $divContainer = $('div.container')
  if (movementsArray.length) { // The Index of Exercise Movements is NOT empty
    $divContainer.html('<h4>Index of Exercise Movements</h4><br>')
    movementsArray.forEach(function(movementObject) {
      let newMovement = new Movement(movementObject)
      let movementHtml = newMovement.formatMoveForIndex()
      $divContainer.append(movementHtml)
    })
  } else { // movementsArray.length === 0 (falsy value), meaning that the Index of Exercise Movements is empty
    $divContainer.html(
      `<div class="alert alert-warning" role="alert">
        The Index of Exercise Movements is currently empty.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">×</span>
        </button>
      </div>`
    )
  }
}
// Below, this refers to the newMovement object on which I'm calling prototype method .formatMoveForIndex()
Movement.prototype.formatMoveForIndex = function() {
  return Movement.listExerciseTemplateFunction(this)
}

Movement.compileListExerciseTemplate = function() {
  Movement.listExerciseTemplateSource = $('#list-exercise-template').html()
  Movement.listExerciseTemplateFunction = Handlebars.compile(Movement.listExerciseTemplateSource)
}
// <button type="button"> has no default behavior, so I don't need to include e.preventDefault() below
Movement.showNextOrPreviousListener = function() {
  $('div.container').on('click', 'button[data-direction]', function(e) {
    let currentMovementId = $(this).data('id')
    let direction = 'previous'
    if ($(this).data('direction') === 'next') {
      direction = 'next'
    }
    const request = {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
    }
    fetch(`/movements/${currentMovementId}/${direction}`)
      .then(response => response.json())
      .then(Movement.show)
      .catch(error => console.error('The exercise movement could not be retrieved due to an error:\n', error))
  })
}

// Below, movementObject parameter = JSON object representation of previous/next AR movement instance in DB
Movement.show = function(movementObject) {
  let newMovement = new Movement(movementObject)
  let movementHtml = newMovement.formatShow()
  history.replaceState(null, null, `/movements/${newMovement.id}`)
  $('div.container').html(movementHtml)
}

Movement.prototype.formatShow = function() {
  return Movement.showExerciseTemplateFunction(this)
}

Movement.compileShowExerciseTemplate = function() {
  Movement.showExerciseTemplateSource = $('#show-exercise-template').html()
  Movement.showExerciseTemplateFunction = Handlebars.compile(Movement.showExerciseTemplateSource)
}