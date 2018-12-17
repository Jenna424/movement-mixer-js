$(() => {
  compileHandlebarsTemplates()
})

const compileHandlebarsTemplates = () => {
  Routine.compileCreateTemplates()
  Movement.compileListMovementTemplate()
  Movement.compileShowMovementTemplate()
  MovementRoutine.compileTechniqueTemplate()
  MovementRoutine.compileMrTemplate()
  MovementRoutine.compileEditMovementRoutineTemplate()
  EquipmentRoutine.compileErTemplate()
  EquipmentRoutine.compileEditEquipmentRoutineTemplate()
  Guide.compileGuideTemplate()
  Target.compileTargetTemplate()
  Training.compileTrainingTemplate()
}
// All of my Handlebars templates are found in app/views/shared/_hs_templates.html.erb view file.
// This partial is always rendered in the <body> of my application layout (app/views/layouts/application.html.erb).
// Therefore, I do NOT have to conditionally compile Handlebars templates depending on whether or not they're present in the current DOM page
// because I know that ALL of my Handlebars templates WILL be present in the current DOM page
// since they are ALL found in my application layout's <body>.
// As such, I must compile all of these templates on initial page load, no matter what page I'm viewing.