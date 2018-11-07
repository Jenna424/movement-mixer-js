function User(user) {
	this.name = user.name
	this.email = user.email
	this.role = user.role
	this.routines = user.routines
}

User.compileUserWorkoutsTemplate = function() {
	User.userWorkoutsTemplateSource = $('#user-workouts-template').html()
	User.userWorkoutsTemplateFunction = Handlebars.compile(User.userWorkoutsTemplateSource)
}
// Below, I manually trigger an AJAX GET request (Standard Client-Side Logic Model)
// Using jQuery, grab link <a class="user-workouts" data-id="user ID goes here">View Workouts Designed by Username</a> found on user show page
// Hijack the click event by binding a new click event to it and 
// preventing the default action of redirecting to "/users/:id"
// Set variable $ul = to the <ul> inside <div id="user-routines"> found on the user show page
// Prepending variable name with $ reminds me I'm working with a jQuery object 
// I assign this variable up here so I can use it later within the callback function(routineObject){...} when I call .append()
// Empty out the <ul> in case there are any stale routines inside of it
// Set variable id = the value of the data-id attribute of the <a> link clicked 
// (which is the ID of the user whose routines we want to see and whose show page we're currently on)
// Interpolating this id into the string URL passed to $.get() method,
// send a jQuery GET request to "/users/:id.json"
// I specify .json extension b/c I want a JSON response, and I have a respond_to block in users#show
// In the callback function(response){...}, I handle the response, which is a JSON object representing @user instance
// that has a key of "routines" pointing to an array of routine objects 
// In UserSerializer, I specified has_many :routines to incorporate the routines data in the JSON representation of @user
// Grabbing this array of routine objects (using response.routines),
// iterate over the array of routine objects using .forEach()
// Each routine object in the array is passed to the callback function as the routineObject parameter
// I'm inserting each routine object's key/value pair data into the Handlebars template to replace the variables inside Handlebars delimiters {{}}
// and then appending the resulting HTML for each one into <ul> within <div id="user-routines">
User.loadUserWorkouts = function() {
  $('.user-workouts').on('click', function(e) {
  	e.preventDefault();
	var $ul = $('#user-routines ul')
	$ul.html('') // empty out the <ul> in case it contains any stale routines
	var id = $(this).attr('data-id')
	$.get(`/users/${id}.json`)
	.done(function(response) {
		response.routines.forEach(function(routineObject) {
	  	$ul.append(User.userWorkoutsTemplateFunction(routineObject))
	  })
	})
  })
}