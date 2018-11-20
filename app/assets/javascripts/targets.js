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
  	var formData = $(this).serialize()
  	$.post("/targets", formData)
  	.done(function(response) {
  	  console.log(response)
  	})
  })
}