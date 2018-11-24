function Routine(routine) {
  this.id = routine.id
  this.title = routine.title
  this.difficulty_level = routine.difficulty_level
  this.duration = routine.duration
  this.movements = routine.movements
  this.movement_routines = routine.movement_routines // to access technique, sets and reps on join model
  this.equipment = routine.equipment
  this.equipment_routines = routine.equipment_routines // to access weight and quantity on join model
  this.targets = routine.targets
  this.trainings = routine.trainings
  this.user = routine.user
}

$(function() {
  Routine.bindEventHandlers()
})

Routine.compileTemplates = function() {
  // Routine Handlebars Template (found in app/views/routines/new.html.erb)
  Routine.routineTemplateSource = $('#routine-template').html();
  Routine.routineTemplateFunction = Handlebars.compile(Routine.routineTemplateSource);
  // Movement Handlebars Template (found in app/views/routines/_movement_fields.html.erb)
  Routine.movementTemplateSource = $('#movement-template').html();
  Routine.movementTemplateFunction = Handlebars.compile(Routine.movementTemplateSource);
  // Equipment Handlebars Template (found in app/views/routines/_equipment_fields.html.erb)
  Routine.equipmentTemplateSource = $('#equipment-template').html();
  Routine.equipmentTemplateFunction = Handlebars.compile(Routine.equipmentTemplateSource);
}

Routine.compileTechniqueTemplate = function() {
  Routine.techniqueTemplateSource = $('#technique-template').html()
  Routine.techniqueTemplateFunction = Handlebars.compile(Routine.techniqueTemplateSource)
}

Routine.compileListWorkoutTemplate = function() {
  Routine.listWorkoutTemplateSource = $('#list-workout-template').html()
  Routine.listWorkoutTemplateFunction = Handlebars.compile(Routine.listWorkoutTemplateSource)
}

Routine.bindEventHandlers = function() {
  Routine.createListener()
  Routine.editExerciseListener()
  Routine.updateExerciseListener()
  Routine.addMovementHandler()
  Routine.addEquipmentHandler()
  Routine.handleWorkoutsIndex()
  Routine.handleShowTechnique()
  Routine.handleHideTechnique()
  Routine.handleCancelEdit()
  Routine.addExerciseListener()
  Routine.addEquipmentListener()
}

Routine.addExerciseListener = function() {
  $('.add-exercise-form').on('submit', function(e) {
    e.preventDefault()
    $.ajax({
      url: $(this).attr('action'), // "/routines/:id"
      method: 'patch',
      dataType: 'json',
      data: $(this).serialize()
    })
    .done(MovementRoutine.addMovementToRoutine) // The response to AJAX PATCH request is the JSON object representation of the MovementRoutine instance (with data about the routine and movement instances to which it belongs)
    $('.add-exercise-form').find('input[type=text], textarea, input[type=number]').val(''); // clear the form
  })
}

Routine.addEquipmentListener = function() {
  $('.add-equipment-form').on('submit', function(e) {
    e.preventDefault()
    $.ajax({
      url: $(this).attr('action'), // "/routines/:id"
      method: 'patch',
      dataType: 'json',
      data: $(this).serialize()
    })
    .done(EquipmentRoutine.addEquipmentToRoutine)
    $('.add-equipment-form').find('input[type=text] input[type=number]').val('')
  })
}

Routine.addMovementHandler = function() {
  $('#add-movement').on('click', function(e) {
    e.preventDefault();
    console.log('hijacked the click event')
    //e.stopPropagation();
    var inputs = $("[name^='routine[movements_attributes]']")
    var lastInput = inputs.last()
    var lastId = lastInput.attr("id")
    var idParts = lastInput.attr("id").split("_")
    var idNumber = idParts[3]
    var newIdNumber = parseInt(idParts[3]) + 1
    var movementHtmlFields = Routine.movementTemplateFunction({id: newIdNumber})
    $('#add-movement').before(movementHtmlFields)
  })
}
// User clicks <button id="add-movement"> to add another movement in the form to create a new workout routine
// I hijack the click event of that button by binding a new click event to it
// Stop the default behavior
// Stop event propagation
// The variable inputs stores an array of <input> fields to create a movement,
// whose name attribute value begins with the string "routine[movements_attributes]"
// which are the fields that I need to reproduce to add another movement to the routine
// Get the last <input> to eventually grab its id
// An id looks something like: "routine_movements_attributes_0_movement_routines_reps"
// Splitting this id string at the underscore: ["routine", "movements", "attributes", "0", "movement", "routines", "reps"]
// The element at index 3 is the id number!

Routine.addEquipmentHandler = function() {
  $('#add-equipment').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    var equipmentFieldsToReplicate = $("[name^='routine[equipment_attributes']");
    var lastEquipmentInput = equipmentFieldsToReplicate.last(); // The last <input> pertaining to equipment
    var lastId = lastEquipmentInput.attr('id'); // lastId stores a string like "routine_equipment_attributes_0_equipment_routines_weight"
    var idParts = lastId.split("_"); // idParts stores array ["routine", "equipment", "attributes", "0", "equipment", "routines", "weight"]
    var lastIndexPosition = idParts[3]; // "0"
    var newIndexPosition = parseInt(lastIndexPosition) + 1;
    var equipmentHtmlFields = Routine.equipmentTemplateFunction({indexPosition: newIndexPosition})
    $('#add-equipment').before(equipmentHtmlFields)
  })
}

Routine.createListener = function() {
  $('#new_routine').on('submit', function(e) {
    e.preventDefault()
    var createFormData = $(this).serialize()
    $.post('/routines', createFormData)
    .done(Routine.createWorkout)
    .fail(Routine.revealErrors)
  })
}
// Below, routineResponse parameter = JSON object representation of AR routine instance that was just created = JSON response I get back from AJAX POST request sent in Routine.createListener()
Routine.createWorkout = function(routineResponse) {
  Routine.preparePreviewPage()
  let newRoutine = new Routine(routineResponse)
  newRoutine.formatAndAppendPreview()
}

Routine.preparePreviewPage = function() {
  var $previewDiv = $('#preview-routine')
  $previewDiv.html('') // empty <div id="preview-routine">, where preview of newly created routine will be displayed
  $previewDiv.addClass('well well-md')
  $('#new_routine').find('input[type=text], textarea, input[type=number]').val(''); // empty the textfields, textareas and numberfields in <form id="new_routine">, in case the user wants to create another routine
  $('#new_routine').find('input[type=checkbox]').prop('checked', false) // uncheck any previously checked checkboxes for target areas and training types
}
// Below, this refers to the newRoutine object on which we're calling the formatAndAppendPreview() prototype method
Routine.prototype.formatAndAppendPreview = function() {
  $('#preview-routine').html(Routine.routineTemplateFunction(this))
}

Routine.revealErrors = function(jqXhrObject) {
  var errorsArray = jqXhrObject.responseJSON.errors
  var errorsString = errorsArray.join('\n') // join array elements (string error messages) with a line break
  alert(`Your attempt to edit this workout routine was unsuccessful:\n\n${errorsString}`)
}

// The link to View All Workouts is found in the navbar, which changes depending on if the viewer is logged in
Routine.handleWorkoutsIndex = function() {
  $('ul.nav').on('click', 'a.all-routines', function(e) {
    e.preventDefault();
    history.replaceState(null, null, "/routines")
    fetch(`/routines.json`)
      .then(response => response.json())
      .then(routinesArray => {
        $('div.container').html('') // clear out <div class="container"> in the <body> of the page (so I can replace its content with Index of Workout Routines below)
        $('div.container').append('<h4>Index of Workout Routines</h4><br>')
        routinesArray.forEach(function(routineObject) {
          let newRoutine = new Routine(routineObject);
          let routineHtml = newRoutine.formatForIndex()
          $('div.container').append(routineHtml)
        })
      })
    })
}

Routine.prototype.formatForIndex = function() {
  return Routine.listWorkoutTemplateFunction(this)
}
// On the routine show page, each movement in the collection of movements that comprise the routine
// has a Show Technique button
// When clicked, this button should add that movement's technique for that routine
// Technique is stored on the movement_routines join table

Routine.handleShowTechnique = function() {
  $('div.panel-default').on('click', '.js-show-technique', function() {
    var $showTechniqueButton = $(this); // $showTechniqueButton stores the Show Technique button that was clicked, which has a data-id property = id of MovementRoutine join table instance whose technique we want
    var mrId = $showTechniqueButton.data('id')
    var $displayTechniqueDiv = $(`#display-technique-${mrId}`)
    $.get(`/mrs/${mrId}`)
    .done(function(response) {
      $showTechniqueButton.hide()
      let newMr = new MovementRoutine(response)
      let techniqueHtml = newMr.formatTechnique()
      $displayTechniqueDiv.html(techniqueHtml)
      $displayTechniqueDiv.addClass('well well-lg')
      //$displayTechniqueDiv.after(`<button class="js-hide-technique btn btn-default btn-sm" data-hide-id=${newMr.id}>Hide Technique</button>`)
    })
  })
}

Routine.handleHideTechnique = function() {
  $('div.panel-default').on('click', '.js-hide-technique', function(e) {
    var mrId = $(this).data('hide-id')
    var displayTechniqueDiv = $(`#display-technique-${mrId}`)
    displayTechniqueDiv.html('')
    displayTechniqueDiv.removeClass('well well-lg')
    $(this).hide()
    var showButton = $(`[data-id=${mrId}]`)
    showButton.show()
  })
}

Routine.editExerciseListener = function() {
  $('div.panel-default').on('click', 'a.edit-exercise', function(e) {
   e.preventDefault()
   var $editLinkClicked = $(this)
   $editLinkClicked.hide()
   var url = $(this).attr('href') // '/mrs/:id/edit'
   $.get(url)
    .done(MovementRoutine.displayEditMrForm)
  })
}
// On the routine show page, the user clicks an Edit Exercise link beside each movement that the user wants to edit in the context of that workout routine.
// Editing an exercise just means updating the technique, sets and reps user-submittable attributes that are stored on the join table movement_routines.
// When the user clicks the Edit Exercise link, the user sees a form to update only the technique, sets and reps of that particular exercise movement in that specific workout routine.
// I'm going to render this form on the routine show page without a page refresh
// Exercise movements are constantly being added/deleted from a workout routine, so due to event delegation,
// bind the click event onto <div class="panel-default">
// Hijack the click event by calling .on() on the jQuery object of this <div>, passing in the name of the event ('click') as the 1st argument to .on()
// The second argument passed to .on() is the <a> link element whose click event we actually want to hijack (the <a class="edit-exercise"> link)
// Prevent the default action, which would be to redirect to "/mrs/:id/edit"
// The Edit Exercise link on the routine show page has a data-mr-id property that stores the id of the MovementRoutine instance I want to edit
// Set mrId variable = the id of the MovementRoutine I want to revise
// Set JavaScript variable $editExerciseDiv = the jQuery object of the <div id="edit-mr-ID OF MOVEMENTROUTINE TO EDIT GOES HERE-div">,
// which is where I will place the form to edit the technique, sets and reps join table attributes 
// Reminder: this refers to the <a class="edit-exercise"> link that was clicked, stored in the variable $editLinkClicked
// Set variable url = href attribute value of this <a> link tag, which is the string URL "/mrs/:id/edit"
// Use jQuery .get() method to send an AJAX GET request to "/mrs/:id/edit".
// The route '/mrs/:id/edit' maps to the #edit_movement_routine action in RoutinesController 
// (I defined a custom route in config/routes.rb)
// $.get(url) returns jqXHR object, on which I call .done(), passing in the callback function
// In routines#edit_movement_routine, I find the instance of MovementRoutine join model that belongs to the specific movement I want to edit in the specific routine
// I render the JSON representation of this instance of MovementRoutine join model
// The response passed to the callback function is the JSON object representation of the instance of MovementRoutine join model whose technique, sets and reps attributes I'm going to edit
// Due to belongs_to :movement and belongs_to :routine macros in MovementRoutineSerializer,
// the response also includes data about the movement and routine instances to which the MovementRoutine instance belongs
// Set newMr variable = a new MovementRoutine object, created with the MovementRoutine constructor function (found in movement_routines.js file)
// and with the JSON response of the the MovementRoutine instance passed in as the argument, so that all key/value attribute data pairs can be set in the new object
// Reminder: in my application layout file, I render the partial app/views/shared/_hs_templates.html.erb
// In this partial, I have a <script id="edit-mr-template", inside of which I have the Handlebars template for generating the form to edit the technique, sets and reps attributes
// In templates.js file, I conditionally compile the template by calling Routine.compileEditMrTemplate() if the template exists on the page
// (It exists on the page because app/views/shared/_hs_templates.html.erb is rendered in my application.html.erb layout file)
// In Routine.compileEditMrTemplate function, I got the HTML string source of the <script id="edit-mr-template">, 
// and then I passed this string HTML into Handlebars.compile()
// to compile the string HTML along w/ any Handlebars {{}} delimiters as part of a function stored as Routine.editMrTemplateFunction
// I can invoke this function, passing in an object whose key names correspond to the variables between the Handlebars delimiters in the template
// Set the variable mrHtml = Routine.editExerciseTemplateFunction(newMr), where newMr is the JS object I created with the JSON response I got back, which represents the instance of the MovementRoutine join model
// mrHtml is the string HTML edit form with all the values filled in
// Set this as the HTML content inside the <div id="edit-mr-MOVEMENTROUTINE ID HERE-div">
// In the DOM, replace the Edit Exercise link that was clicked with the actual edit form w/ technique, sets and reps values filled in
Routine.updateExerciseListener = function() {
  $(document).on('submit', 'form.edit-mr', function(e) {
    e.preventDefault()
    var $form = $(this)
    var action = $(this).attr('action') // "/mrs/:id"
    var mrId = action.split('/')[2]
    $form.hide() // hide the edit-mr form once it's submitted
    $form.parent().removeClass('well well-lg') // remove "well well-lg" classes from edit-mr form container: <div id="edit-mr-MR ID HERE-div">)
    $(`a[data-mr-id=${mrId}]`).show() // show the Edit Exercise link on routine show page
    $.ajax({
      url: action, // "/mrs/:id"
      method: 'patch',
      data: $form.serialize(),
      dataType: 'json'
    })
    .done(MovementRoutine.update)
    .fail(MovementRoutine.revealErrors)
  })
}

Routine.handleCancelEdit = function() {
  $(document).on('click', 'input.cancel-edit', function(e) {
    var mrId = $(this).data('mr-id')
    $(`form.edit-mr-${mrId}`).hide()
    $(`a[data-mr-id=${mrId}]`).show()
    $(`div#edit-mr-${mrId}-div`).removeClass('well well-lg')
  })
}

Routine.compileEditEquipmentTemplate = function() {
  Routine.editEquipmentTemplateSource = $('#edit-equipment-template').html()
  Routine.editEquipmentTemplateFunction = Handlebars.compile(Routine.editEquipmentTemplateSource)
}