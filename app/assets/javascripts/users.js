function User(user) {
  this.name = user.name
  this.email = user.email
  this.role = user.role
  this.routines = user.routines
  this.guides = user.guides
}

$(function() {
  User.loadClientWorkouts();
})
// <div id="user-stats"> is always found on the user show page.
// However, the content inside this <div> will change depending on the role of the user whose profile page we're viewing.
// If the user is a client, div#user-stats contains a link to view that client's workout routines.
// If the user is a trainer, div#user-stats contains a link to view that trainer's training guides.
User.loadClientWorkouts = function() {
  $('div#user-stats').on('click', 'a.client-workouts', function(e) {
  	e.preventDefault()
  	console.log('Clicked the link to view workout routines by this client!')
  })
}