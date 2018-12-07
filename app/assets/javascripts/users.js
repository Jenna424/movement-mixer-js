function User(user) {
  this.name = user.name
  this.email = user.email
  this.role = user.role
  this.routines = user.routines
  this.guides = user.guides
}

$(() => {
  loadBelongsToDeclarer() // A workout routine belongs_to a client, and a training guide belongs_to a trainer
  User.destroyListener()
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
  $userRoutinesDiv.addClass('client-routines')
}

User.loadUserGuides = function(userObject) {
  const $userGuidesDiv = $('div#belongs-to-user')
  $userGuidesDiv.html(`<h4>Here are some training pointers from ${userObject.name}:</h4>`)
  userObject.guides.forEach(function(guideObject) {
    $userGuidesDiv.append(Guide.guideTemplateFunction(guideObject))
  })
  $userGuidesDiv.addClass('trainer-guides')
}

User.destroyListener = function() {
  $('.delete-account').parent().on('submit', function(e) {
    e.preventDefault()
    if (confirm('This account will be permanently deleted if you choose to proceed.')) {
      $.ajax({
        url: $(this).attr('action'), // "/users/:id"
        method: 'DELETE',
        dataType: 'json',
        data: $(this).serialize()
      })
       .done(User.destroy)
    }
  })
}
//<form style="display:inline-block" class="button_to" method="post" action="/users/:id">
//  <input type="hidden" name="_method" value="delete">
//  <button data-confirm="This account will be permanently deleted. Are you sure you want to proceed?" 
//  class="btn btn-sm btn-default delete-account" type="submit">
//    <span class="glyphicon glyphicon-trash"></span> <small>Delete Account</small>
//  </button>
//  <input type="hidden" name="authenticity_token" value="string authenticity token here==">
//</form>