function User(user) {
	this.name = user.name
	this.email = user.email
	this.role = user.role
	this.routines = user.routines
}

$(function() {
	User.compileUserWorkoutsTemplate()
})

User.compileUserWorkoutsTemplate = function() {
	User.userWorkoutsTemplateSource = $('#user-workouts-template').html()
	User.userWorkoutsTemplateFunction = Handlebars.compile(User.userWorkoutsTemplateSource)
}