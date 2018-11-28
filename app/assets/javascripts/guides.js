function Guide(guide) {
  this.id = guide.id
  this.proper_form = guide.proper_form
  this.breathing_technique = guide.breathing_technique
  this.modification = guide.modification
  this.challenge = guide.challenge
  this.movement = guide.movement
  this.user = guide.user
}

$(function() {
  Guide.bindClickEventHandlers()
})

Guide.bindClickEventHandlers = function() {
  Guide.handleFormSubmission()
  Guide.getGuidesListener()
}

Guide.handleFormSubmission = function() {
  $('#new_guide').on('submit', function(e) {
    e.preventDefault()
    var url = $(this).attr('action')
    var formData = $(this).serialize()
    $.post(url, formData)
    .done(function(response) {
      $('#new_guide').find('textarea').val('');
      var $displayGuideDiv = $('#display-guide')
      $displayGuideDiv.html('')
      let newGuide = new Guide(response)
      let guideHtml = newGuide.formatShow()
      $displayGuideDiv.html(guideHtml)
    })
  })
}
// Use jQuery to grab the form to create a new training guide full of training tips for a particular exercise movement
// Hijack the submit event of this <form id="new_guide">
// Prevent the default submit action, which is normally a POST request to "/movements/:movement_id/guides"
// Set the variable url = the string URL "/movements/the-movement-id-goes-here/guides"
// Set the variable formData = serialization of the form
// Reminder: this refers to the <form id="new_guide">
// Using jQuery .post() method, send an AJAX POST request to "/movements/:movement_id/guides" with the serialized form data
// .post() returns a jqXHR Object, on which I call .done() to handle the response
// In the callback function passed to .done(),
// response is a JSON object representation of the AR guide instance that was just created in guides#create
// Due to belongs_to :movement and belongs_to :user macros in GuideSerializer,
// the response also contains data about the movement and user instances to which the guide instance belongs

Guide.prototype.formatShow = function() {
  return Guide.guideTemplateFunction(this)
}
// On the movement show page, there is an a.all-guides link to View All Training Guides that belong to that particular exercise movement
// Since we can flip through movements, i.e. see next movement/previous movement using .fetch() call,
// the link to view that movement's guides is not always present in the DOM on initial payload
// Therefore, call .on() directly on div.container, which is always on the page, and then check to see if a.all-guides was clicked
Guide.getGuidesListener = function() {
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
  Guide.guideTemplateSource = $('#training-guide-template').html()
  Guide.guideTemplateFunction = Handlebars.compile(Guide.guideTemplateSource)
}
