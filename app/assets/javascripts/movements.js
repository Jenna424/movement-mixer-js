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

// In the context of formatMoveForIndex() prototype method,
// this refers to the JSON movement object
// on which formatMoveForIndex() is called