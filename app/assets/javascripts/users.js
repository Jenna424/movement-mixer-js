function User(user) {
  this.name = user.name
  this.email = user.email
  this.role = user.role
  this.routines = user.routines
  this.guides = user.guides
}

$(() => {
  loadBelongsToDeclarer() // A workout routine belongs_to a client, and a training guide belongs_to a trainer
})
// loading the model that declares the belongs_to :user association (i.e. loading routines/guides that belong to the user)
const loadBelongsToDeclarer = () => {
  $('div#designer-data').on('click', 'a[class^=load-user]', function(e) {
    e.preventDefault() // prevent the default behavior of clicking the link, which would have been a normal HTTP GET request to "/users/:id", redirecting to the user show page and redrawing the DOM 
    let id = $(this).data('id') // stores the id of the user whose workout routines/training guides we want to view
    var loadAssociationFunction = User.loadUserRoutines // var-declared variables are function-scoped
    if ($(this).attr('class').split('-')[2] === 'guides') {
      loadAssociationFunction = User.loadUserGuides
    }
    $(this).hide() // hide the link (a.load-user-routines or a.load-user-guides) once it's been clicked
    $.get(`/users/${id}.json`)
      .done(loadAssociationFunction)
      .fail(handleError)
  })
}

User.loadUserRoutines = function(userObject) {
  const $userRoutinesDiv = $('div#belongs-to-user') // variables declared with const are immutable, but the value of the variable CAN change, e.g., $userRoutinesDiv will always point to div#belongs-to-user, but the contents of the div change as routines are appended to it in the iteration
  $userRoutinesDiv.html(`<h3>Workout Routines Designed by ${userObject.name}</h3>`)
  userObject.routines.forEach(function(routineObject) {
    $userRoutinesDiv.append(Routine.routineTemplateFunction(routineObject))
  })
  $userRoutinesDiv.addClass('blue-belongs-to')
}

User.loadUserGuides = function(userObject) {
  const $userGuidesDiv = $('div#belongs-to-user')
  $userGuidesDiv.html(`<p>Here are some personal training pointers from ${userObject.name}:</p>`)
  userObject.guides.forEach(function(guideObject) {
    $userGuidesDiv.append(Guide.guideTemplateFunction(guideObject))
  })
  $userGuidesDiv.addClass('blue-belongs-to')
}