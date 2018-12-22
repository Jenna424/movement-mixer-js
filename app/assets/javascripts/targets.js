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
// Below, targetObject parameter = JSON object representation of newly created A.R. target instance = successful JSON response I get back from AJAX POST request sent in Target.createListener()
Target.create = function(targetObject) {
  if ($('ul#target-areas-list li').length === 0 && $('p#no-target-areas').length === 0) { // If there are currently NO <li>s inside ul#target-areas-list AND p#no-target-areas is NOT present on the current page,
    $('a.view-target-areas').show() // now that a new workout target area exists, ensure that the link to View Workout Target Areas is visible so I'll be able to click it to view the new <li>
  }
  let newTarget = new Target(targetObject)
  newTarget.showIfIndexLinkClicked()
  newTarget.alertCreationSuccessful()
}
// Below, this refers to the newTarget object on which I'm calling prototype method .showIfIndexLinkClicked()
Target.prototype.showIfIndexLinkClicked = function() {
  if ($('ul#target-areas-list li').length || $('p#no-target-areas').length) { // Prior to creating a new target area, the trainer clicked the View Workout Target Areas link
    $('ul#target-areas-list').append(this.formatLi()) // append <li> for the new target area just created to ul#target-areas-list
    if ($('ul#target-areas-list li').length === 1) { // The <li> just added is the only one inside ul#target-areas-list
      $('ul#target-areas-list').before("<h3 id='all-target-areas'>All Workout Target Areas</h3>")
    }
  }
  if ($('p#no-target-areas').length) { // Prior to creating a new target area, the trainer clicked the View Workout Target Areas link, but there were none, so p#no-target-areas was displayed.
    $('p#no-target-areas').remove() // Now that a new target area has been created, the collection is no longer empty, so remove p#no-target-areas
  }
}
// Below, this refers to the newTarget object (i.e. this in showIfIndexLinkClicked) on which I'm now calling prototype method .formatLi()
Target.prototype.formatLi = function() {
  return Target.targetTemplateFunction(this)
}

Target.compileTargetTemplate = function() {
  Target.targetTemplateSource = $('#target-template').html()
  Target.targetTemplateFunction = Handlebars.compile(Target.targetTemplateSource)
}
// Below, this refers to the newTarget object on which I'm calling prototype method .alertCreationSuccessful()
Target.prototype.alertCreationSuccessful = function() {
  $('div#message-container').html(
    `<div class="alert alert-success" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
      <h4 class="alert-heading">You successfully created a new target area!</h4>
      <p>Clients can now design workout routines that focus on sculpting and strengthening one's ${this.focus.toLowerCase()}.</p>
      <hr>
      <p class="mb-0"><em>Get ready to feel the burn!</em></p>
    </div>`
  )
}

Target.testValidity = function(jqXhrObject) {
  if (jqXhrObject.responseJSON && jqXhrObject.responseJSON.errors.length) {
    let validationError = jqXhrObject.responseJSON.errors.pop()
    alert(`Your attempt to create a target area was unsuccessful:\n${validationError}`)
  } else {
    console.error(`Your attempt to create a target area was unsuccessful due to the following error: ${jqXhrObject.statusText} (status code ${jqXhrObject.status})`)
  }
}
// The link to View Workout Target Areas is ALWAYS found in app/views/targets/new.html.erb view file, so that the trainer can see a list of existing workout target areas before creating a new one.
Target.indexListener = function() {
  $('a.view-target-areas').on('click', function(e) {
    e.preventDefault() // prevent the default behavior of sending a normal HTTP GET request to "/targets"
    $(this).hide()
    let requestObject = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    }
    fetch('/targets', requestObject)
      .then(response => response.json())
      .then(Target.index)
      .catch(error => console.error('Workout target areas could not be retrieved due to the following error:', error))
  })
}
// Below, targetsArray parameter = array of all target objects = successful JSON response I get back from fetch('/targets', requestObject) sent in Target.indexListener()
Target.index = function(targetsArray) {
  let $targetAreasList = $('ul#target-areas-list') // ul#target-areas-list is ALWAYS found in app/views/targets/new.html.erb
  $targetAreasList.html('') // empty ul#target-areas-list in case it contains any stale target area <li>s
  if (targetsArray.length) { // if there are target objects in the array (i.e. the collection is NOT empty)
    $targetAreasList.before("<h3 id='all-target-areas'>All Workout Target Areas</h3>")
    targetsArray.forEach(function(targetObject) {
      let newTarget = new Target(targetObject)
      $targetAreasList.append(newTarget.formatLi())
    })
  } else {
    $targetAreasList.before("<p id='no-target-areas'><em>No workout target areas were found.</em></p>")
  }
}
// Below, event delegation is necessary because target area <li>s are constantly being added to/deleted from ul#target-areas-list
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
// Below, targetObject parameter = JSON object representation of the A.R. target instance that was just destroyed = successful JSON response I get back from AJAX DELETE request sent in Target.destroyListener()
Target.destroy = function(targetObject) {
  let newTarget = new Target(targetObject)
  newTarget.deleteLi()
  if ($('ul#target-areas-list li').length === 0) {
    $('h3#all-target-areas').remove()
  }
  newTarget.alertDeletionSuccessful()
}
// Below, this refers to the newTarget object on which I'm calling prototype method .deleteLi()
Target.prototype.deleteLi = function() {
  $(`li#target-${this.id}`).remove() // find the <li> corresponding to the target that was deleted, and then remove it
}
// Below, this refers to the newTarget object on which I'm calling prototype method .alertDeletionSuccessful()
Target.prototype.alertDeletionSuccessful = function() {
  $('div#message-container').html(
    `<div class="alert alert-success" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
      <h4 class="alert-heading">You successfully deleted a target area.</h4>
      <p>Workout routines will no longer target one's ${this.focus.toLowerCase()}.</p>
    </div>`
  )
}