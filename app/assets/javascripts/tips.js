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
  Tip.handleTipSubmission()
}

Tip.handleTipSubmission = function() {
  $('#new_tip').on('submit', function(e) { // Grab the <form id="new_tip"...> and hijack its submit event
    e.preventDefault() // prevent the default submit action of the form
    var url = $(this).attr('action') // Route & Controller Mapping: post '/movements/:movement_id/tips' => 'tips#create'
    var formData = $(this).serialize()
    $.post(url, formData)
    .done(function(response) {
      $('#latest-tip').html('') // empty out <div id="latest-tip"> on movement show page (in case it contains a stale tip)
      var newTip = new Tip(response) // create a new tip object from the constructor function and store it in JS variable newTip
      var tipHtml = newTip.formatShowTip() // call prototype method formatShowTip() on newTip JSON object
      $('#latest-tip').append(tipHtml)
    })
  })
}
// response is JSON object representation of the @tip instance just created in tips#create
// Due to the macros I added to TipSerializer, the response also includes data 
// about the user and movement to which the tip belongs