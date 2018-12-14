function Target(target) {
  this.id = target.id
  this.focus = target.focus
}

$(() => {
  Target.createListener()
  Target.indexListener()
  Target.destroyListener()
})

Target.createListener = function() {
  $('form#new_target').on('submit', function(e) {
    e.preventDefault()
    let formData = $(this).serialize()
    $('input[type=text]').val('') // empty the text_field where trainer types in focus
    $.post('/targets', formData)
      .done(Target.create)
      .fail(Target.testValidity)
  })
}
// targetObject parameter below = JSON object representation of newly created AR target instance = successful JSON response I get back from AJAX POST request sent using $.post() method in Target.createListener()
Target.create = function(targetObject) {
  let newTarget = new Target(targetObject)
  newTarget.showIfIndexLinkClicked()
  newTarget.alertCreationSuccessful()
}

Target.prototype.showIfIndexLinkClicked = function() {
  if ($('ul#target-areas-list li').length || $('p#no-target-areas').length) { // Prior to creating a new target area, the View Workout Target Areas link was clicked
    $('ul#target-areas-list').append(this.formatLi()) // append <li> for the new target area just created to ul#target-areas-list
  }
  if ($('p#no-target-areas').length) { // Prior to creating a new target area, the View Workout Target Areas link was clicked, but there were none, so p#no-target-areas was displayed.
    $('p#no-target-areas').remove() // Now that a new target area has been created, the collection is no longer empty, so remove p#no-target-areas
  }
}

Target.prototype.alertCreationSuccessful = function() {
  $('div#message-container').html(
    `<div class="alert alert-success" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">x</span>
      </button>
      <h4 class="alert-heading">You successfully created a new target area!</h4>
      <p>Clients can now design workout routines that focus on sculpting and strengthening one's ${this.focus.toLowerCase()}.</p>
    </div>`
  ) 
}

Target.prototype.formatLi = function() {
  return Target.targetTemplateFunction(this)
}

Target.compileTargetTemplate = function() {
  Target.targetTemplateSource = $('#target-template').html()
  Target.targetTemplateFunction = Handlebars.compile(Target.targetTemplateSource)
}

Target.testValidity = function(jqXhrObject) {
  if (jqXhrObject.responseJSON && jqXhrObject.responseJSON.errors.length) {
    let validationError = jqXhrObject.responseJSON.errors.pop()
    alert(`Your attempt to create a new target area was unsuccessful:\n${validationError}`)
  } else {
    console.error(`Your attempt to create a target area was unsuccessful due to the following error: ${jqXhrObject.statusText} (status code ${jqXhrObject.status})`)
  }
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
    $link.replaceWith("<h3 id='all-target-areas'>All Workout Target Areas</h3>")
    targetsArray.forEach(function(targetObject) {
      let newTarget = new Target(targetObject)
      $targetAreasList.append(newTarget.formatLi())
    })
  } else {
    $link.replaceWith("<p id='no-target-areas'><em>No workout target areas were found.</em></p>")
  }
}

Target.destroyListener = function() {
  $('ul#target-areas-list').on('submit', 'form.delete-target-area', function(e) {
    e.preventDefault()
    if (confirm('Are you sure you want to delete this target area?')) {
      $.ajax({
        url: $(this).attr('action'), // '/targets/:id'
        method: 'DELETE',
        dataType: 'json',
        data: $(this).serialize()
      })
        .done(Target.destroy)
        .fail(handleError)
    }
  })
}
// targetObject parameter below = JSON object representation of the AR target instance that was just destroyed = JSON response to AJAX DELETE request sent in Target.destroyListener()
Target.destroy = function(targetObject) {
  let newTarget = new Target(targetObject)
  newTarget.deleteLi()
  if ($('ul#target-areas-list li').length === 0) {
    $('h3#all-target-areas').remove()
  }
  $('div#message-container').html(
    `<div class="alert alert-success" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">x</span>
      </button>
      <h4 class="alert-heading">You successfully deleted a target area.</h4>
      <p>Workout routines will no longer be classified by the following body focus: <em>${newTarget.focus}</em></p>
    </div>`
  )
}

Target.prototype.deleteLi = function() { // this refers to the newTarget object on which .deleteLi() prototype method is called
  $(`li#target-${this.id}`).remove() // find the <li> corresponding to the target that was deleted, and then remove it
}
