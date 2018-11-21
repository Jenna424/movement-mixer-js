function Target(target) {
  this.id = target.id
  this.focus = target.focus
}

$(function() {
  Target.createListener()
  Target.indexListener()
  Target.destroyListener()
})

Target.compileTargetTemplate = function() {
  Target.targetTemplateSource = $('#target-template').html()
  Target.targetTemplateFunction = Handlebars.compile(Target.targetTemplateSource)
}

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
  $divContainer.html('<h3>Where You\'ll Feel the Burn</h3>') // add <h4> header to the page
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
  return Target.targetTemplateFunction(this)
}

Target.createListener = function() {
  $('#new_target').on('submit', function(e) {
  	e.preventDefault()
    $targetAreaDiv = $('div#target-area-added')
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

Target.prototype.formatDiv = function() {
  $targetAreaDiv.html(`<br><p>We can now mix movements in workouts that target <strong>${this.focus}</strong>!</p>`)
}

Target.destroyListener = function() {
  $('div.container').on('click', 'form.delete-target-area', function(e) {
    e.preventDefault()
    if (confirm('Are you sure you want to delete this target area?')) {
      $.ajax({
        url: $(this).attr('action'), // '/targets/:id'
        method: 'DELETE',
        dataType: 'json',
        data: $(this).serialize()
      })
      .done(Target.destroy)
    } else {
      console.log("Deletion of target area was not confirmed")
    }
  })
}
// The json parameter below = JSON object representation of the AR target instance that was just destroyed = the JSON response to AJAX DELETE request sent in Target.destroyListener()
Target.destroy = function(json) {
  var newTarget = new Target(json)
  newTarget.deleteLi()
}
