// My home.js file will contain JS code for the navigation links
// The navigation links will change depending on who the current user is (unassigned/client/trainer/admin)
// In handleExerciseGuideClick(), due to event delegation, call jQuery .on() method directly on the <ul class="nav navbar-nav">,
// a stable element that is always on the page
// then target the link I want by passing "a.all-movements" as the second argument to .on() method

$(function() {
  handleExerciseGuideClick()
})

function handleExerciseGuideClick() {
  $('ul.nav').on('click', 'a.all-movements', function(e) {
  	e.preventDefault();
	console.log("HIJACKED 'READ EXERCISE GUIDE' LINK CLICK")
	fetch(`/movements.json`)
	  .then(response => response.json())
	  .then(movementsArray => {
	  	movementsArray.forEach(function(movementObject) {
	  	  let newMove = new Movement(movementObject)
	  	  let moveHtml = newMove.formatMoveForIndex()
	  	})
	  })
	})
}