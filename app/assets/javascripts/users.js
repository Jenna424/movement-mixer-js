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

User.loadUserGuides = function(userObject) {
  var $userGuidesDiv = $('div#belongs-to-association')
  $userGuidesDiv.html(`<h4><strong>Training Guides Designed by ${userObject.name}</strong></h4>`)
  userObject.guides.forEach(function(guideObject) {
    $userGuidesDiv.append(Guide.guideTemplateFunction(guideObject))
  })
}