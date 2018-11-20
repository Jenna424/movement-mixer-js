function Target(target) {
  this.id = target.id
  this.focus = target.focus
}

$(function() {
  Target.createListener()
})

Target.createListener = function() {
  $('#new_target').on('submit', function(e) {
  	e.preventDefault()
  	console.log("Hijacked the submit event of the form to create a new target area!")
  })
}