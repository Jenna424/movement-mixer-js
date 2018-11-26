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
// Prevent the default behavior, which would be a normal HTTP GET request to "/movements/:id"
// Once the link to see a movement is clicked, empty out div.container, i.e., clear the page so I can eventually replace page content with info about that exercise movement
// $(this) = the show-exercise link that was clicked, which has an href attribute value = "/movements/ID OF MOVEMENT TO VIEW GOES HERE"
// $(this).attr('href') retrieves the string URL href attribute value, which I then split at the slash .split('/') to get an array.
// The element at index 2 of this array = the id of the movement I want to view
// store id of movement to be viewed in id variable
// Using jQuery .get() method, make AJAX GET request to "/movements/id-of-movement-to-view"
Movement.showListener = function() {
  $('div.panel-body').on('click', 'a.show-exercise', function(e) {
    e.preventDefault()
    $('div.container').html('')
    var id = $(this).attr('href').split('/')[2]
    history.replaceState(null, null, `/movements/${id}`)
    $.get(`/movements/${id}`)
    .done(Movement.show)
  })
}
// Below, movementJson parameter = JSON object representation of the movement instance we want to view without redirecting to its show page = response to AJAX GET request sent in Movement.showListener()
// The response also includes data about the guides that belong to the movement due to has_many :guides in MovementSerializer
Movement.show = function(movementJson) {
  var newMovement = new Movement(movementJson)
  var movementHtml = newMovement.formatShow()
  $('div.container').append(movementHtml)
}

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