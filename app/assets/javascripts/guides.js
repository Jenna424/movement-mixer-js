function Guide(guide) {
  this.id = guide.id
  this.proper_form = guide.proper_form
  this.breathing_technique = guide.breathing_technique
  this.modification = guide.modification
  this.challenge = guide.challenge
  this.movement = guide.movement
  this.user = guide.user
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
  Tip.getGuides()
}

Tip.handleFormSubmission = function() {
  $('#new_tip').on('submit', function(e) {
    e.preventDefault()
    var url = $(this).attr('action') // "/movements/:movement_id/tips"
    var formData = $(this).serialize()
    $.post(url, formData)
    .done(function(response) {
      $('#new_tip').find('input[type=text], textarea').val('');
      $div = $('#latest-tip') // $div variable stores jQuery object of <div id="latest-tip">
      $div.html('') // empty out <div id="latest-tip"> in case it contains a stale tip
      var newTip = new Tip(response) // response is JSON object representation of @tip AR instance just created in tips#create. Due to belongs_to :movement and belongs_to :user macros in TipSerializer, the response also includes data about the movement and user to which the tip belongs
      var tipHtml = newTip.formatShow() 
      $div.html(tipHtml)
    })
  })
}

Tip.prototype.formatShow = function() {
  return Tip.tipTemplateFunction(this)
}
// In the context of formatShow prototype method, this refers to the JSON tip object on which formatShow() is called

Tip.prototype.formatIndex = function() {
  return Tip.compileTipTemplateFunction(this)
}

Tip.getGuides = function() {
  $('.all-guides').on('click', function(e) {
    e.preventDefault()
    $.get($(this).attr('href'))
    .done(function(guidesArray) {
      var $div = $('#training-guides');
      $div.html('')
      guidesArray.forEach(function(guideObject) {
        let newGuide = new Guide(guide)
        let guideHtml = newGuide.formatGuideForIndex()
        $div.append(guideHtml)
      })
    })
  })
}
