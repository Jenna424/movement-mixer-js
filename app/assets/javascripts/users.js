function User(user) {
  this.name = user.name
  this.email = user.email
  this.role = user.role
  this.routines = user.routines
  this.guides = user.guides
}

$(function() {
  User.loadUserWorkouts();
})

User.loadUserWorkouts = function() {
  $('.user-workouts').on('click', function(e) {
  	e.preventDefault();
	var $div = $('#user-routines');
	$div.html('') // empty out the <div id="user-routines"> in case it contains any stale routines
	var id = $(this).attr('data-id');
	$.get(`/users/${id}.json`)
	.done(function(response) {
	  response.routines.forEach(function(routineObject) {
	  	$div.append(User.userWorkoutsTemplateFunction(routineObject))
	  })
	})
  })
}