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
  Movement.handleNextExercise()
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
  	history.replaceState(null, null, "movements")
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

Movement.handleNextExercise = function() {
  $(document).on('click', '.js-next-move', function(e) {
    var currentMoveId = $(this).data('id')
    fetch(`/movements/${currentMoveId}/next`)
      .then(response => response.json())
      .then(nextMovementObject => {
        history.replaceState(null, null, `/movements/${nextMovementObject.id}`)
        let $divContainer = $('div.container')
        $divContainer.html('')
        let newMovement = new Movement(nextMovementObject)
        let movementHtml = newMovement.formatShow()
        $divContainer.html(movementHtml)
      })
  })
}

Movement.prototype.formatShow = function() {
  let exerciseHtml = `
  <h3>${this.name}</h3>
  <a class="all-guides" href="movements/{{this.id}}/guides">View All Training Guides</a>
  <br><br>
  <button class="js-previous-move btn btn-default btn-sm" data-id="${this.id}">Previous Exercise</button>
  <button class="js-next-move btn btn-default btn-sm" data-id="${this.id}">Next Exercise</button>
  `
  return exerciseHtml
}

// In the context of formatMoveForIndex() prototype method,
// this refers to the JSON movement object
// on which formatMoveForIndex() is called