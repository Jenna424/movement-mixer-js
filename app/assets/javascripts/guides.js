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

Guide.isValidObject = function(properForm, breathingTechnique, modification, challenge, requestType) {
  let $guideErrorsDiv = $('div.container').find('div#guide-errors')
  let headingText = 'Your attempt to create a training guide was unsuccessful.'
  if (requestType === 'patch') {
    headingText = 'Your attempt to revise this training guide was unsuccessful.'
  }
  if (properForm.trim().length === 0 || breathingTechnique.trim().length === 0 || modification.trim().length === 0 || challenge.trim().length === 0) {
    $guideErrorsDiv.html(
      `<div class="alert alert-danger" role="alert">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">×</span>
        </button>
        <h4 class="alert-heading">${headingText}</h4>
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
    if (Guide.isValidObject(properForm, breathingTechnique, modification, challenge, requestType)) {
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
// Below, the guideObject parameter = JSON object representation of AR guide instance that was just created/updated = JSON response to AJAX POST/PATCH request made using $.ajax() method in Guide.formSubmissionHandler()
// Due to belongs_to :movement and belongs_to :user macros in GuideSerializer,
// the response also contains data about the movement and user instances to which the guide instance belongs
Guide.createOrUpdate = function(guideObject) {
  let newGuide = new Guide(guideObject)
  let guideHtml = newGuide.formatShow()
  $('div#display-guide').html(guideHtml)
  $('div#message-container').html(
    `<div class="alert alert-success" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">×</span>
      </button>
      Your changes were successful!
    </div>`
  )
  if ($('form#new_guide').length) { // User created a NEW training guide (form#new_guide is present on the current page)
    $('div#training-guides').html('') // empty div#training-guides in case it currently displays guides, since I do not automatically append data for the guide just created
    Guide.updateCount()
  }
}

Guide.prototype.formatShow = function() {
  return Guide.guideTemplateFunction(this)
}

Guide.compileGuideTemplate = function() {
  Guide.guideTemplateSource = $('#guide-template').html()
  Guide.guideTemplateFunction = Handlebars.compile(Guide.guideTemplateSource)
}

Guide.updateCount = function() {
  let stringCount = $('div.container').find('li')[1].innerText.split(': ').pop()
  let newCount = parseInt(stringCount) + 1
  $('div.container').find('li')[1].innerText = `Training guides available for use: ${newCount}`
}
// On the movement show page, there is an a.exercise-guides link to View Training Guides that belong to that particular exercise movement
// Since we can flip through movements, i.e. see next movement/previous movement using .fetch() call,
// the link to view that movement's guides is not always present in the DOM on initial payload
// Therefore, call .on() directly on div.container, which is always on the page, and then check to see if a.exercise-guides was clicked
Guide.getGuidesHandler = function() {
  $('div.container').on('click', 'a.exercise-guides', function(e) {
    e.preventDefault() // prevent the default behavior of sending a regular HTTP GET request to "/movements/:movement_id/guides"
    let movementId = $(this).data('id')
    $(this).hide()
    $.get(`/movements/${movementId}/guides`)
      .done(Guide.index)
      .fail(handleError)
  })
}
// Below, the guidesArray parameter = JSON array representation of all AR guide instances belonging to the particular exercise movement
// = an array of guide objects = response from AJAX GET request sent using $.get() in Guide.getGuidesHandler()
// The View Training Guides link is only displayed if the collection of guides belonging to the movement is NOT empty,
// so the function below can only be triggered if training guides exist for the specific movement
// div#training-guides is always found on the movement show view
Guide.index = function(guidesArray) {
  $('div#training-guides').html(`<h3>All Training Guides for Performing ${guidesArray[0].movement.name}</h3>`)
  guidesArray.forEach(function(guideObject) {
    let newGuide = new Guide(guideObject)
    let guideHtml = newGuide.formatShow()
    $('div#training-guides').append(guideHtml)
  })
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
        .fail(handleError)
    }
  })
}
// Below, guideObject parameter = JSON object representation of AR guide instance that was just destroyed = response to AJAX DELETE request sent using $.ajax() method in Guide.destroyHandler()
Guide.destroy = function(guideObject) {
  let newGuide = new Guide(guideObject)
  let exerciseName = newGuide.movement.name
  let guideDesigner = newGuide.user.name
  $('div.container').html(
    `<div class=\'alert alert-success\' role=\'alert\'>Your training guide for performing ${exerciseName} was successfully deleted. Please provide more training tips soon, ${guideDesigner}!</div>`
  )
}