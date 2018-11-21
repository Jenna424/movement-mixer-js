function Target(target) {
  this.id = target.id
  this.focus = target.focus
}

$(function() {
  Target.createListener()
  Target.indexListener()
})

Target.indexListener = function() {
  $('ul.nav').on('click', 'a.view-target-areas', function(e) {
    e.preventDefault()
    $.get('/targets')
    .done(Target.index)
  })
}
// The targetsArray parameter below is an array of all JSON target objects. This array is the JSON response I got back from the AJAX GET request sent via $.get() method in Target.indexListener()
Target.index = function(targetsArray) {
  var targetAreasList = $('ul.target-areas')
  targetsArray.forEach(function(targetObject) {
    targetAreasList.html('')
  })
}

Target.createListener = function() {
  $('#new_target').on('submit', function(e) {
  	e.preventDefault()
  	var formData = $(this).serialize()
  	$.post("/targets", formData)
  	.done(Target.create)
  	$('#new_target input[type=text]').val('')
  })
}
// json parameter below = JSON object representation of newly created AR target instance = response from AJAX POST request sent with $.post() method in Target.createListener()
Target.create = function(json) {
  var newTargetArea = new Target(json)
  newTargetArea.formatAndAppendLi()
}