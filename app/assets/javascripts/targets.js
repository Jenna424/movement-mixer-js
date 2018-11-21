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
    Target.preparePage()
    $.get('/targets')
    .done(Target.index)
  })
}

Target.preparePage = function() {
  $divContainer = $('div.container') // retrieve the <div class="container"> that holds the main page content
  $divContainer.html('') // empty out the <div class="container">
  $divContainer.html('<h4>Where You\'ll Feel the Burn</h4>') // add <h4> header to the page
  $divContainer.append('<ul class="target-areas"></ul>') // add <ul> (where target areas will be listed) to the page
}
// The targetsArray parameter below is an array of all JSON target objects. This array is the JSON response I got back from the AJAX GET request sent via $.get() method in Target.indexListener()
Target.index = function(targetsArray) {
  var targetAreasList = $('ul.target-areas')
  targetsArray.forEach(function(targetObject) {
    var newTarget = new Target(targetObject)
    targetAreasList.append(newTarget.formatLi())
  })
}

Target.prototype.formatLi = function() {
  return `<li>${this.focus}</li>` // this refers to each newTarget (from the iteration in Target.index) on which I'm calling .formatLi() prototype method
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
  newTargetArea.formatDiv()
}