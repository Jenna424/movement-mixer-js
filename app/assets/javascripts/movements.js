function Movement(movement) {
	this.id = movement.id
	this.name = movement.name
	this.tips = movement.tips
	this.movement_routines = movement.movement_routines // to access user-submittable attributes (technique, sets, reps) stored in join table
	this.routines = movement.routines
}

Movement.compileListMovementTemplate = function() {
	Movement.listMovementTemplateSource = $('#list-movement-template').html()
	Movement.listMovementTemplateFunction = Handlebars.compile(Movement.listMovementTemplateSource)
}