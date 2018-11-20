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
  	.done(Target.create)
  })
}
// json parameter below = JSON object representation of newly created AR target instance = response from AJAX POST request sent with $.post() method in Target.createListener()
Target.create = function(json) {
  var newTargetArea = new Target(json)
  newTargetArea.formatAndAppendLi()
}