function Guide(guide) {
  this.id = guide.id
  this.proper_form = guide.proper_form
  this.breathing_technique = guide.breathing_technique
  this.modification = guide.modification
  this.challenge = guide.challenge
  this.movement = guide.movement
  this.user = guide.user
}

Guide.compileGuideTemplate = function() {
  Guide.guideTemplateSource = $('#training-guide-template').html()
  Guide.guideTemplateFunction = Handlebars.compile(Guide.guideTemplateSource)
}

$(function() {
  Guide.bindClickEventHandlers()
})

Guide.bindClickEventHandlers = function() {
  Guide.handleFormSubmission()
  Guide.getGuides()
}