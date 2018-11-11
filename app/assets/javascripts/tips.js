function Tip(tip) {
  this.id = tip.id
  this.proper_form = tip.proper_form
  this.breathing_technique = tip.breathing_technique
  this.modification = tip.modification
  this.challenge = tip.challenge
  this.movement = tip.movement
  this.user = tip.user
}

Tip.compileTipTemplate = function() {
  Tip.tipTemplateSource = $('#tip-template').html()
  Tip.tipTemplateFunction = Handlebars.compile(Tip.tipTemplateSource)
}

$(function() {
  Tip.bindClickEventHandlers()
})

Tip.bindClickEventHandlers = function() {
  Tip.handleFormSubmission()
}

Tip.handleFormSubmission = function() {
  $('#new_tip').on('submit', function(e) {
    e.preventDefault()
    var url = $(this).attr('action') // "/movements/:movement_id/tips"
    var formData = $(this).serialize()
    $.post(url, formData)
    .done(function(response) {
      $div = $('#latest-tip') // $div variable stores jQuery object of <div id="latest-tip">
      $div.html('') // empty out <div id="latest-tip"> in case it contains a stale tip
      var newTip = new Tip(response) // response is JSON object representation of @tip AR instance just created in tips#create. Due to belongs_to :movement and belongs_to :user macros in TipSerializer, the response also includes data about the movement and user to which the tip belongs
      var tipHtml = newTip.formatShow() 
      $div.html(tipHtml)
    })
  })
}