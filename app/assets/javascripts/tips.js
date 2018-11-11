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