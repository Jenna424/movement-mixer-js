function User(user) {
  this.id = user.id
  this.name = user.name
  this.email = user.email
  this.role = user.role
  this.routines = user.routines
  this.guides = user.guides
}

$(() => {
  loadBelongsToDeclarer() // A workout routine belongs_to a client, and a training guide belongs_to a trainer
  User.indexListener()
  User.destroyListener()
})
// loading objects of the model that declares the belongs_to :user association (i.e. loading routines/guides that belong to the user)
const loadBelongsToDeclarer = () => {
  $('a[class^=load-user]').on('click', function(e) {
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
  let newUser = new User(userObject)
  const $userRoutinesDiv = $('div#belongs-to-user') // variables declared with const are immutable, but the value of the variable CAN change, e.g., $userRoutinesDiv will always point to div#belongs-to-user, but the contents of the div change as routines are appended to it in the iteration
  $userRoutinesDiv.html(`<h3>Workout Routines Designed by ${newUser.name}</h3>`)
  newUser.routines.forEach(function(routineObject) {
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
// The users index link is ALWAYS found in the navigation when the logged-in user is a client/trainer/admin
User.indexListener = function() {
  $('a.index-users').on('click', function(e) {
    e.preventDefault() // prevent the default behavior, which would be a normal HTTP GET request to '/users'
    history.pushState(null, null, '/users')
    let requestObject = {
      method: 'GET',
      headers: { 'ContentType': 'application/json' },
      credentials: 'include'
    }
    fetch('/users', requestObject)
      .then(response => response.json())
      .then(User.index)
      .catch(error => console.error('The Index of Users could not be retrieved due to the following error:', error))
  })
}
// Below, usersArray parameter = JSON array of user objects (or an empty collection) = successful JSON response I get back from .fetch('/users', requestObject) sent in User.indexListener()
User.index = function(usersArray) {
  if (usersArray.length === 0) { // If the collection is empty (i.e. usersArray contains NO user objects)
    User.alertIndexEmpty()
  } else { // the collection is NOT empty (i.e. usersArray contains user objects)
    $('div.container').html('<h3><em>~Movement Mixers~</em></h3>')
    usersArray.forEach(function(userObject) {
      let newUser = new User(userObject)
      $('div.container').append(newUser.formatLi())
    })
  }
}

User.alertIndexEmpty = function() {
  $('div.container').html(
    `<div class="alert alert-warning" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
      The Index of Users is currently empty.
    </div>`
  )
}
// Below, this refers to the newUser object on which I'm calling prototype method .formatLi()
User.prototype.formatLi = function() {
  return `<li><a href='/users/${this.id}'>${this.name}</a></li>`
}

User.destroyListener = function() {
  $('div.container').find('.delete-account').parent().on('submit', function(e) {
    e.preventDefault()
    if (confirm('This account will be permanently deleted.')) {
      history.pushState(null, null, '/')
      $.ajax({
        url: $(this).attr('action'), // "/users/:id"
        method: 'DELETE',
        dataType: 'json',
        data: $(this).serialize()
      })
       .done(User.destroy)
       .fail(handleError)
    }
  })
}
// A user who is NOT an admin can delete her own account on the user show page.
// An admin can delete other users' accounts in the <table> found in app/views/users/accounts.html.erb
// The form below enables account deletion and is generated by the Rails helper button_to:
//<form style="display:inline-block" class="button_to" method="post" action="/users/:id">
//  <input type="hidden" name="_method" value="delete">
//  <button class="btn btn-sm btn-default delete-account" type="submit">
//    <span class="glyphicon glyphicon-trash"></span> <small>Delete Account</small>
//  </button>
//  <input type="hidden" name="authenticity_token" value="string authenticity token here==">
//</form>
// Only an admin can access app/views/users/accounts.html.erb page, which contains a <table> with the buttons (forms) to delete user accounts.
// Check to see if there is a <table> on the current page in the DOM, and if so, we know we're on the accounts.html.erb view file, so
// so we know the current user is an admin
// Below, userJson parameter = JSON object representation of AR user instance that was just deleted
User.destroy = function(userJson) {
  let newUser = new User(userJson) // declare newUser variable with let because it will point to DIFFERENT user objects
  if ($('div.container').find('table').length) {
    newUser.deleteTableRow()
  } else {
    newUser.deleteProfilePage()
  }
}

User.prototype.deleteTableRow = function() {
  $(`#user-${this.id}-row`).remove()
  $('div#message-container').html(
    `<div class="alert alert-success" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">×</span>
      </button>
      ${this.name}'s account was successfully deleted!
    </div>`
  )
}

User.prototype.deleteProfilePage = function() {
  let farewell = `Thank you for planning your workouts with Movement Mixer, ${this.name}!`
  if (this.role === 'trainer') {
    farewell = `Thank you for providing training tips, ${this.name}!`
  } else if (this.role === 'unassigned') {
    farewell = `The Movement Mixer community bids you farewell.`
  }
  $('div.container').html(
    `<div class="alert alert-success" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">×</span>
      </button>
      <h4 class="alert-heading">Your account was successfully deleted.</h4>
      <p>${farewell}</p>
      <hr>
      <p mb-0>Good luck with your fitness training, and remember – always finish <em><strong>strong</strong>!</em></p>
    </div>`
  )
  setLoggedOutLinks()
}