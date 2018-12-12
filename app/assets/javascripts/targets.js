function Target(target) {
  this.id = target.id
  this.focus = target.focus
}

$(() => {
  Target.createListener()
  Target.indexListener()
  Target.destroyListener()
})

Target.compileTargetTemplate = function() {
  Target.targetTemplateSource = $('#target-template').html()
  Target.targetTemplateFunction = Handlebars.compile(Target.targetTemplateSource)
}

Target.prototype.formatLi = function() {
  return Target.targetTemplateFunction(this)
}

Target.createListener = function() {
  $('form#new_target').on('submit', function(e) {
    e.preventDefault()
    let formData = $(this).serialize()
    $.post('/targets', formData)
      .done(Target.create)
      .fail(Target.testValidity)
  })
}
// targetObject parameter below = JSON object representation of newly created AR target instance = response from AJAX POST request sent with $.post() method in Target.createListener()
Target.create = function(targetObject) {
  $('input[type=text]').val('') // empty the text_field where trainer types in focus after form submission
  let newTargetArea = new Target(targetObject)
  $('div#message-container').html(
    `<div class="alert alert-success" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">x</span>
      </button>
      <h4 class="alert-heading">You successfully recorded a new target area!</h4>
      <p>Clients can now design workout routines that focus on sculpting and strengthening ${newTargetArea.focus}.</p>
      <hr>
      <p class="mb-0">You may view the updated list of target areas by clicking the link at the bottom of this page.</p>
    </div>`
  )
}

// The link to View Workout Target Areas is ALWAYS found in app/views/targets/new.html.erb view file,
// so that the trainer can see a list of existing workout target areas before creating a new one.
Target.indexListener = function() {
  $('a.view-target-areas').on('click', function(e) {
    e.preventDefault() // prevent the default behavior of sending a normal HTTP GET request to "/targets"
    fetch('/targets')
      .then(response => response.json())
      .then(Target.index)
      .catch(error => console.error('The Index of Workout Target Areas could not be retrieved due to an error:\n', error))
  })
}
// The targetsArray parameter below = array of all target objects = the JSON response I got back from fetch('/targets') in Target.indexListener()
// ul#target-areas-list is ALWAYS found in app/views/targets/new.html.erb view file
Target.index = function(targetsArray) {
  let $targetAreasList = $('ul#target-areas-list')
  let $link = $('a.view-target-areas')
  if (targetsArray.length) {
    $link.replaceWith('<h4>All Workout Target Areas</h4>')
    targetsArray.forEach(function(targetObject) {
      let newTarget = new Target(targetObject)
      $targetAreasList.append(newTarget.formatLi())
    })
  } else {
    $link.replaceWith('<p><em>No workout target areas are recorded.</em></p>')
  }
}

Target.destroyListener = function() {
  $('div.container').on('submit', 'form.delete-target-area', function(e) {
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

Target.prototype.deleteLi = function() { // this refers to the newTarget object on which .deleteLi() prototype method is called
  $(`li#target-${this.id}`).remove() // find the <li> corresponding to the target that was deleted, and then remove it
}
