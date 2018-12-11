function Guide(guide) {
  this.id = guide.id
  this.proper_form = guide.proper_form
  this.breathing_technique = guide.breathing_technique
  this.modification = guide.modification
  this.challenge = guide.challenge
  this.movement = guide.movement
  this.user = guide.user
}

$(() => {
  Guide.bindEventHandlers()
})

Guide.bindEventHandlers = function() {
  Guide.getGuidesHandler()
  Guide.formSubmissionHandler() // handles submission of both create AND edit forms
  Guide.destroyHandler()
}

Guide.isValidObject = function(properForm, breathingTechnique, modification, challenge) {
  let $guideErrorsDiv = $('div.container').find('div#guide-errors')
  if (properForm.trim().length === 0 || breathingTechnique.trim().length === 0 || modification.trim().length === 0 || challenge.trim().length === 0) {
    $guideErrorsDiv.html(
      `<div class="alert alert-danger" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">×</span>
        </button>
        <h4 class="alert-heading">Your attempt to create a training guide was unsuccessful.</h4>
        <p>A training guide <strong>must</strong> specify the proper form and breathing technique for performing an exercise, and it <strong>must</strong> propose a modification and a challenge.</p>
      </div>`
    )
    return false
  } else {
    return true
  }
}

Guide.formSubmissionHandler = function() {
  $('div.container').on('submit', 'form[class$=_guide]', function(e) {
    e.preventDefault()
    if ($('div.alert-danger').length) {
      $('div.alert-danger').hide()
    }
    let $form = $(this)
    let requestType = ($form.find('input[name=_method]').val() || 'post')
    let action = $form.attr('action') // either POST "/movements/:movement_id/guides" or PATCH "/movements/:movement_id/guides/:id"
    let formData = $form.serialize()
    let properForm = $form.find('textarea[id=guide_proper_form]').val()
    let breathingTechnique = $form.find('textarea[id=guide_breathing_technique]').val()
    let modification = $form.find('textarea[id=guide_modification]').val()
    let challenge = $form.find('textarea[id=guide_challenge]').val()
    $form.find('textarea').val('') //clear text_areas after form submission
    if (Guide.isValidObject(properForm, breathingTechnique, modification, challenge)) {
      $.ajax({
        method: requestType,
        url: action,
        dataType: 'json',
        data: formData
      })
        .done(Guide.createOrUpdate)
        .fail(error => console.error(`Your training guide was not created because an error occurred:\n ${error.statusText} (status code ${error.status})`))
    }
  })
}
// Below, the guideObject parameter = JSON object representation of AR guide instance that was just created/updated = JSON response to AJAX POST/PATCH request made using $.ajax() method in Guide.formSubmissionListener()
// Due to belongs_to :movement and belongs_to :user macros in GuideSerializer,
// the response also contains data about the movement and user instances to which the guide instance belongs
Guide.createOrUpdate = function(guideObject) {
  let newGuide = new Guide(guideObject)
  let guideHtml = newGuide.formatShow()
  $('div#display-guide').html(guideHtml)
  $('div#message-container').html(`<div class=\'alert alert-success\' role=\'alert\'>Your changes were successful!</div>`)
}
// The form to create a new training guide has a class of "new_guide"
// The form to edit an existing training guide has a class of "edit_guide"
// To hijack the default submit action of either form dynamically, 
// check if the user is trying to submit any form that has a class ending in "_guide"
// Prevent the default submit action, which is either a normal HTTP POST request to "/movements/:movement_id/guides"
// if the user is trying to create a new training guide, or a normal HTTP PATCH request to "/movements/:movement_id/guides/:id",
// if the user is trying to edit an existing training guide.
// When the form submit button is clicked, hide any success alert <div>s/error alert <div>s, if they exist on the page.
// If no such alert <div>s exist on the page $('div.alert').length is 0, which is falsy in JavaScript
// $form variable stores either the create guide form or the edit guide form, depending on which one the user tried to submit
// requestType variable stores either the string 'patch' or 'post'
// action variable stores either the string URL path "/movements/:movement_id/guides/:id" (for PATCH) or "/movements/:movement_id/guides" (for POST)
// formData variable stores the serialized form data submitted either as part of the AJAX PATCH request or the AJAX POST request
// properForm variable stores value submitted in textarea for proper_form attribute of guide
// breathingTechnique variable stores value submitted in textarea for breathing_technique attribute of guide
// modification variable stores value submitted in textarea for modification attribute of guide
// challenge variable stores value submitted in textarea for challenge attribute of guide

// The form to create a new training guide belonging to a particular exercise movement is found on the movement show page,
// and in the Handlebars template inside script#show-exercise-template.
// This is because the movement show page contains buttons to view the next and previous exercise movements without a page refresh,
// via fetch().
// Since the user may have navigated to another movement via the Previous Exercise/Next Exercise button,
// the form to create a new training guide belonging to that specific movement
// might not be in the DOM when the page is initially loaded

Guide.prototype.formatShow = function() {
  return Guide.guideTemplateFunction(this)
}
// On the movement show page, there is an a.all-guides link to View All Training Guides that belong to that particular exercise movement
// Since we can flip through movements, i.e. see next movement/previous movement using .fetch() call,
// the link to view that movement's guides is not always present in the DOM on initial payload
// Therefore, call .on() directly on div.container, which is always on the page, and then check to see if a.all-guides was clicked
Guide.getGuidesHandler = function() {
  $('div.container').on('click', 'a.all-guides', function(e) {
    e.preventDefault() // prevent the default behavior of sending a regular GET HTTP request to movement_guides_path(movement instance here)
    var movementId = $(this).data('id')
    $.get(`/movements/${movementId}/guides`)
    .done(Guide.index)
  })
}
// Below, the guidesArray parameter = JSON object array representation of all AR guide instances belonging to the particular exercise movement = response from AJAX GET request sent using $.get() in Guide.getGuidesListener()
Guide.index = function(guidesArray) {
  if (guidesArray.length) { // If guidesArray is NOT an empty collection
    $('div#training-guides').html(`<h4>Training Guides for Performing ${guidesArray[0].movement.name}</h4>`)
    guidesArray.forEach(function(guideObject) {
      let newGuide = new Guide(guideObject)
      let guideHtml = newGuide.formatGuideForIndex()
      $('div#training-guides').append(guideHtml)
    })
  } else { // The collection of training guides belonging to the specific exercise movement is empty (0 is falsy in JavaScript)
    $('a.all-guides').replaceWith('<p><em>No training guides are currently available for use.</em></p>')
  }
}

Guide.prototype.formatGuideForIndex = function() {
  return Guide.guideTemplateFunction(this)
}

Guide.compileGuideTemplate = function() {
  Guide.guideTemplateSource = $('#guide-template').html()
  Guide.guideTemplateFunction = Handlebars.compile(Guide.guideTemplateSource)
}

Guide.destroyHandler = function() {
  $('input.delete-guide').parent().on('submit', function(e) {
    e.preventDefault()
    if (confirm('Are you sure you want to delete this training guide?')) {
      $.ajax({
        url: $(this).attr('action'), // "/movements/:movement_id/guides/:id"
        method: 'DELETE',
        dataType: 'json',
        data: $(this).serialize()
      })
      .done(Guide.destroy)
    }
  })
}

Guide.destroy = function(guideObject) {
  $('div.container').html('')
  let newGuide = new Guide(guideObject)
  let exerciseName = newGuide.movement.name
  let guideDesigner = newGuide.user.name
  $('div.container').append(`<div class=\'alert alert-success\' role=\'alert\'>Your training guide for performing ${exerciseName} was successfully deleted. Please provide more training tips soon, ${guideDesigner}!</div>`)
}