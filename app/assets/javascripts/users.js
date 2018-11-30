function User(user) {
  this.name = user.name
  this.email = user.email
  this.role = user.role
  this.routines = user.routines
  this.guides = user.guides
}

$(function() {
  User.loadBelongsToListener() // A workout routine belongs_to a client, and a training guide belongs_to a trainer.
})
// <div id="user-routines">, <div id="user-guides"> and <div id="user-stats"> are always found on the user show page.
// However, the content inside div#user-stats will change depending on the role of the user whose profile page we're viewing.
// If the user is a client, div#user-stats contains a link to view that client's workout routines,
// as long as this routines collection is NOT empty.
// If the user is a trainer, div#user-stats contains a link to view that trainer's training guides,
// as long as this guides collection is NOT empty.
// VIEWING A CLIENT'S WORKOUT ROUTINES:
// Call .on() directly on $('div#user-stats'), which is always on the user show page, 
// and then check to see if the <a> link w/ class = 'client-workouts' was clicked,
// by passing in 'a.client-workouts' as the second argument of .on()
// Prevent the default behavior, which would normally redirect us to the user show page "/users/:id"
// Store the id of the user whose workout routines we want to view in the variable id
// Send an AJAX GET request using $.get() method to "/users/:id.json", interpolating the value of the id variable into this string URL path
// userObject parameter = response we get back from AJAX GET request = JSON object representation of the AR user instance whose show page we're currently on (and whose workout routines we want to see)
// Due to the has_many :routines macro in UserSerializer class, this JSON response also contains data about that user's workout routines
// (namely, the JSON user object has a "routines" key that points to an array of routine objects)
// In #show action of UsersController, I specify render json: @user, include: ['routines.equipment', 'routines.targets', 'routines.trainings']
// Therefore, not only does the JSON response representation of @user instance include data about the collection of routines that belong to that user,
// but the JSON response ALSO includes nested data about the associated pieces of equipment, target areas and training types for those routines. 
// (In the RoutineSerializer class, I include the 3 macros: has_many :equipment, has_many :targets and has_many :trainings)
User.loadBelongsToListener = function() {
  $('div#user-designs').on('click', "a[class^='load-user']", function(e) {
    e.preventDefault()
    var id = $(this).data('id') // stores the id of the user whose workout routines/training guides we want to view
    var loadAssociationFunction = User.loadUserRoutines
    if ($(this).attr('class').split('-')[2] === 'guides') {
      loadAssociationFunction = User.loadUserGuides
    }
    $(this).hide()
    $.get(`/users/${id}.json`)
    .done(loadAssociationFunction)
    $('div#belongs-to-association').addClass('belongs-to-user') // adds light blue background
  })
}

User.loadUserRoutines = function(userObject) {
  var $userRoutinesDiv = $('div#belongs-to-association')
  $userRoutinesDiv.html(`<h4><strong>Workout Routines Designed by ${userObject.name}</strong></h4>`)
  userObject.routines.forEach(function(routineObject) {
    $userRoutinesDiv.append(Routine.routineTemplateFunction(routineObject))
  })
}