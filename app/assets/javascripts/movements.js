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
// The link to View Exercise Guide is ALWAYS found in the navigation when the logged-in user is unassigned/client/trainer/admin
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
      .then(Movement.index)
      .catch(error => console.error('The exercise guide could not be retrieved due to the following error:\n', error))
  })
}
// Below, movementsArray parameter = JSON array of movement objects = JSON representation of AR::Relation of all movement instances = successful JSON response from fetch('/movements') called in Movement.indexListener(). This collection can also be empty.
Movement.index = function(movementsArray) {
  let $divContainer = $('div.container')
  if (movementsArray.length) { // The exercise guide contains exercise movements (i.e. the collection is NOT empty)
    $divContainer.html('<h3>Exercise Guide</h3><span><em>~Index of Exercise Movements~</em></span><br><br>')
    movementsArray.forEach(function(movementObject) {
      let newMovement = new Movement(movementObject)
      $divContainer.append(newMovement.formatForIndex())
    })
  } else { // movementsArray.length === 0 (falsy value), meaning that the Index of Exercise Movements is empty
    $divContainer.html(
      `<div class="alert alert-warning" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        The Index of Exercise Movements is empty.
      </div>`
    )
  }
}
// Below, this refers to the newMovement object on which I'm calling prototype method .formatForIndex()
Movement.prototype.formatForIndex = function() {
  return Movement.listMovementTemplateFunction(this)
}

Movement.compileListMovementTemplate = function() {
  Movement.listMovementTemplateSource = $('#list-movement-template').html()
  Movement.listMovementTemplateFunction = Handlebars.compile(Movement.listMovementTemplateSource)
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
      .catch(error => console.error(`The ${direction} exercise movement could not be retrieved due to the following error:\n`, error))
  })
}

// Below, movementObject parameter = JSON object representation of previous/next AR movement instance in DB
Movement.show = function(movementObject) {
  let newMovement = new Movement(movementObject)
  let movementHtml = newMovement.formatShow()
  history.pushState(null, null, `/movements/${newMovement.id}`)
  $('div.container').html(movementHtml)
}

Movement.prototype.formatShow = function() {
  return Movement.showExerciseTemplateFunction(this) // this refers to the newMovement object on which I'm calling prototype method .formatShow()
}

Movement.compileShowMovementTemplate = function() {
  Movement.showExerciseTemplateSource = $('#show-exercise-template').html()
  Movement.showExerciseTemplateFunction = Handlebars.compile(Movement.showExerciseTemplateSource)
}