function Movement(movement) {
	this.id = movement.id
	this.name = movement.name
	this.tips = movement.tips
	this.movement_routines = movement.movement_routines // to access user-submittable attributes (technique, sets, reps) stored in join table
	this.routines = movement.routines
}

$(function() {
	Movement.bindClickEventHandlers()
})

Movement.bindClickEventHandlers = function() {
	Movement.handleExerciseIndex()
  Movement.showListener()
  Movement.handleNextExercise()
  Movement.handlePreviousExercise()
}

Movement.compileListExerciseTemplate = function() {
  Movement.listExerciseTemplateSource = $('#list-exercise-template').html()
  Movement.listExerciseTemplateFunction = Handlebars.compile(Movement.listExerciseTemplateSource)
}

Movement.compileShowExerciseTemplate = function() {
  Movement.showExerciseTemplateSource = $('#show-exercise-template').html()
  Movement.showExerciseTemplateFunction = Handlebars.compile(Movement.showExerciseTemplateSource)
}

Movement.prototype.formatMoveForIndex = function() {
	return Movement.listExerciseTemplateFunction(this)
}

Movement.handleExerciseIndex = function() {
  $('ul.nav').on('click', 'a.all-movements', function(e) {
    e.preventDefault();
  	history.replaceState(null, null, "/movements")
  	fetch(`/movements.json`)
      .then(response => response.json())
      .then(movementsArray => {
        $('div.container').html('')
        $('div.container').append('<h4>Guide to Exercise</h4><br>')
        movementsArray.forEach(function(movementObject) {
          let newMove = new Movement(movementObject)
          let moveHtml = newMove.formatMoveForIndex()
          $('div.container').append(moveHtml)
        })
      })
  })
}
// Explanation of Movement.showListener
// On the routine show page, the user can click a link to view a particular exercise movement included in that workout routine,
// at which point an AJAX GET request is made to "/movements/:id", so we can see the movement's "show page" without a page refresh.
// The link to show a particular exercise movement is not necessarily in the DOM on initial payload, 
// depending on what exercise movements are included in the workout routine.
// Also, movements are constantly being added to/deleted from a workout routine.
// Therefore, call .on() on div.panel-body, which is always on the routine show page, and then see if the user clicked a.show-exercise
Movement.showListener = function() {
  $('div.panel-body').on('click', 'a.show-exercise', function(e) {
    e.preventDefault()
    console.log('clicked show exercise button for movement in routine')
    var $divContainer = $('div.container')
    var id = $(this).attr('href').split('/')[2]
    console.log(id)
    history.replaceState(null, null, `/movements/${id}`)
    $.get(`/movements/${id}`)
    .done(function(response) {
      $divContainer.html('')
      var newMovement = new Movement(response)
      var movementHtml = newMovement.formatShow()
      $divContainer.html(movementHtml)
    })
  })
}
// The response is a JSON object representation of the movement instance we want to view without redirecting to show page
// The response also includes data about the guides that belong to the movement due to has_many :guides in MovementSerializer

Movement.prototype.formatShow = function() {
  return Movement.showExerciseTemplateFunction(this)
}

Movement.handleNextExercise = function() {
  $(document).on('click', '.js-next-move', function(e) {
    var currentMoveId = $(this).data('id')
    console.log(currentMoveId)
    fetch(`/movements/${currentMoveId}/next`)
      .then(response => response.json())
      .then(nextMovementObject => {
        history.replaceState(null, null, `/movements/${nextMovementObject.id}`)
        let $divContainer = $('div.container')
        $divContainer.html('')
        let newMovement = new Movement(nextMovementObject)
        console.log(newMovement)
        let movementHtml = newMovement.formatShow()
        $divContainer.html(movementHtml)
      })
  })
}

Movement.handlePreviousExercise = function() {
  $(document).on('click', '.js-previous-move', function(e) {
    var currentMoveId = $(this).data('id')
    fetch(`/movements/${currentMoveId}/previous`)
      .then(response => response.json())
      .then(previousMovementObject => {
        history.replaceState(null, null, `/movements/${previousMovementObject.id}`)
        let $divContainer = $('div.container')
        $divContainer.html('')
        let newMovement = new Movement(previousMovementObject)
        let movementHtml = newMovement.formatShow()
        $divContainer.html(movementHtml)
      })
  })
}
// In the context of formatMoveForIndex() prototype method,
// this refers to the JSON movement object
// on which formatMoveForIndex() is called