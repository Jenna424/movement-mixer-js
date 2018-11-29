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

User.loadClientWorkouts = function() {
}