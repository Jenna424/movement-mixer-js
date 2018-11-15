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
  Routine.bindClickEventHandlers()
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
  // Target Handlebars Template (found in app/views/routines/_target_fields.html.erb)
  Routine.targetTemplateSource = $('#target-template').html();
  Routine.targetTemplateFunction = Handlebars.compile(Routine.targetTemplateSource);
  // Training Handlebars Template (found in app/views/routines/_training_fields.html.erb)
  Routine.trainingTemplateSource = $('#training-template').html();
  Routine.trainingTemplateFunction = Handlebars.compile(Routine.trainingTemplateSource);
}

Routine.compileTechniqueTemplate = function() {
  Routine.techniqueTemplateSource = $('#technique-template').html()
  Routine.techniqueTemplateFunction = Handlebars.compile(Routine.techniqueTemplateSource)
}

Routine.compileListWorkoutTemplate = function() {
  Routine.listWorkoutTemplateSource = $('#list-workout-template').html()
  Routine.listWorkoutTemplateFunction = Handlebars.compile(Routine.listWorkoutTemplateSource)
}

Routine.bindClickEventHandlers = function() {
  Routine.addMovementHandler()
  Routine.addEquipmentHandler()
  Routine.addTargetAreaHandler()
  Routine.addTrainingTypeHandler()
  Routine.handleCreateFormSubmission()
  Routine.handleWorkoutsIndex()
  Routine.handleShowTechnique()
  Routine.handleHideTechnique()
  Routine.handleEditExercise()
  Routine.handleCancelEdit()
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

Routine.addTargetAreaHandler = function() {
  $('#add-target').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    var targetAreaFieldsToReplicate = $("[name^='routine[targets_attributes]'");
    var lastTargetAreaInput = targetAreaFieldsToReplicate.last();
    var lastId = lastTargetAreaInput.attr("id");
    var idParts = lastId.split("_");
    var lastIndexPosition = idParts[3];
    var newIndexPosition = parseInt(lastIndexPosition) + 1;
    var targetAreaHtml = Routine.targetTemplateFunction({indexPosition: newIndexPosition})
    $('#add-target').before(targetAreaHtml)
  })
}

Routine.addTrainingTypeHandler = function() {
  $('#add-training').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    var trainingTypeFieldsToReplicate = $("[name^='routine[trainings_attributes']");
    var lastTrainingTypeInput = trainingTypeFieldsToReplicate.last();
    var lastId = lastTrainingTypeInput.attr("id");
    var idParts = lastId.split("_");
    var lastIndexPosition = idParts[3];
    var newIndexPosition = parseInt(lastIndexPosition) + 1;
    var trainingTypeHtml = Routine.trainingTemplateFunction({ indexPosition: newIndexPosition })
    $('#add-training').before(trainingTypeHtml)
  })
}

Routine.handleCreateFormSubmission = function() {
  $('#new_routine').on('submit', function(e) {
    e.preventDefault()
    var url = $(this).attr('action') // "/routines"
    var formData = $(this).serialize()
    $.post(url, formData)
    .done(function(response) {
      $('#preview-routine').html('')
      $('#new_routine').find('input[type=text], textarea, input[type=number]').val('');
      let newRoutine = new Routine(response)
      let routineHtml = newRoutine.formatPreview()
      $('#preview-routine').html(routineHtml)
    })
  })
}

Routine.prototype.formatPreview = function() {
  return Routine.routineTemplateFunction(this) // this refers to the JSON routine object on which we're calling the formatPreview() prototype method
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
// has a Show Full Technique button
// When clicked, this button should add that movement's technique for that routine
// Technique is stored on the movement_routines join table 
Routine.handleShowTechnique = function() {
  $('div.panel-default').on('click', '.js-show-technique', function(e) {
    var $showTechniqueButton = $(this); // $showTechniqueButton stores the Show Technique button that was clicked, which has data-routine-id and data-movement-id properties (data attributes)
    var routineId = $(this).data('routine-id')
    var movementId = $(this).data('movement-id')
    $.get(`/routines/${routineId}.json`)
    .done(function(response) {
      $showTechniqueButton.hide()
      var $div = $(`#technique-move-${movementId}`);
      $div.html('') // clear out the <div id="toggle-technique">
      var mrsArray = response.movement_routines
      var filteredArray = mrsArray.filter(function(mrObject){ 
        return mrObject.movement_id === movementId
      })
      var technique = filteredArray[0].technique
      //var $div = $(`#movement-${movementId}`)
      //$div.html('')
      $div.append("<h5><em>Your Unique Technique</em>:</h5>")
      $div.append(technique)
      //var $hideButton = $(`button[class='js-hide-technique'][data-movement-id='${movementId}']`)
      //$hideButton.attr("disabled", false);
    })
  })
}

Routine.handleHideTechnique = function() {
  $('div.panel-default').on('click', '.js-hide-technique', function(e) {
    console.log("clicked hide movement's technique")
    var $hideButton = $(this);
    console.log($hideButton)
    var movementId = $hideButton.data('movement-id')
    var techniqueDiv = $(`div#technique-move-${movementId}`);
    if (techniqueDiv.text().trim().length) { // If there is technique text inside <div>
      techniqueDiv.html('') // empty out the <div>
      var $showButton = $(`#show-technique-${movementId}`)
      console.log($showButton)
      $showButton.show()
    } else {
      console.log('The div was empty to begin with!')
    }
  })
}

Routine.compileEditExerciseTemplate = function() {
  Routine.editExerciseTemplateSource = $('#edit-exercise-template').html()
  Routine.editExerciseTemplateFunction = Handlebars.compile(Routine.editExerciseTemplateSource)
}

Routine.displayEditExerciseForm = function() {
  $(document).on('click', 'a.edit-exercise', function(e) {
    e.preventDefault()
    var $editLinkClicked = $(this)
    var movementId = $(this).data('id')
    var $editExerciseDiv = $(`#edit-exercise-${movementId}-div`)
    var url = $(this).attr('href') // "/routines/:routine_id/movements/:movement_id/edit"
    $.get(url)
    .done(function(response) {
      let newMr = new MovementRoutine(response)
      let mrHtml = Routine.editExerciseTemplateFunction(newMr)
      $editExerciseDiv.html(mrHtml)
      $editLinkClicked.hide()
      $editExerciseDiv.show()
    })
  })
}
// On the routine show page, the user clicks an Edit Exercise link beside each movement that the user wants to edit in the context of that workout routine.
// Editing an exercise just means updating the technique, sets and reps user-submittable attributes that are stored on the join table movement_routines.
// When the user clicks the Edit Exercise link, the user sees a form to update only the technique, sets and reps of that particular exercise movement in that specific workout routine.
// I'm going to render this form on the routine show page without a page refresh
// Exercise movements are constantly being added/deleted from a workout routine, so due to event delegation,
// bind the click event onto the document itself
// Hijack the click event by calling .on() on the jQuery document object, passing in the name of the event ('click') as the 1st argument to .on()
// The second argument passed to .on() is the <a> link element whose click event we actually want to hijack (the <a class="edit-exercise"> link)
// Prevent the default action, which would be to redirect to "/routines/:routine_id/movements/:movement_id/edit"
// The Edit Exercise link on the routine show page has a data-exercise property that stores the id of the movement instance I want to edit
// Set movementId variable = the id of the movement I want to revise
// Set JavaScript variable $editExerciseDiv = the jQuery object of the <div id="edit-exercise-ID OF MOVEMENT TO EDIT GOES HERE-div">,
// which is where I will place the form to edit the technique, sets and reps join table attributes 
// Reminder: this refers to the <a class="edit-exercise"> link that was clicked, stored in the variable $linkClicked
// Set variable url = href attribute value of this <a> link tag, which is the string URL "/routines/ROUTINE ID HERE/movements/MOVEMENT ID HERE/edit"
// Use jQuery .get() method to send an AJAX GET request to "/routines/:routine_id/movements/:movement_id/edit".
// The route '/routines/:routine_id/movements/:movement_id/edit' maps to the #edit_movement_routine action in RoutinesController 
// (I defined a custom route in config/routes.rb)
// $.get(url) returns jqXHR object, on which I call .done(), passing in the callback function
// In routines#edit_movement_routine, I find the instance of MovementRoutine join model that belongs to the specific movement I want to edit in the specific routine
// I render the JSON representation of this instance of MovementRoutine join model
// The response passed to the callback function is the JSON object representation of the instance of MovementRoutine join model whose technique, sets and reps attributes I'm going to edit
// Due to belongs_to :movement and belongs_to :routine macros in MovementRoutineSerializer,
// the response also includes data about the movement and routine instances to which the MovementRoutine instance belongs
// Clear out the <div id="edit-exercise-ID OF MOVEMENT TO BE EDITED HERE-div">, just in case it contains a stale edit form
// Set newMr variable = a new MovementRoutine object, created with the MovementRoutine constructor function (found in movement_routines.js file)
// and with the JSON response of the the MovementRoutine instance passed in as the argument, so that all key/value attribute data pairs can be set in the new object
// Reminder: in my application layout file, I render the partial app/views/shared/_hs_templates.html.erb
// In this partial, I have a <script id="edit-exercise-template", inside of which I have the Handlebars template for generating the form to edit the technique, sets and reps attributes
// In templates.js file, I conditionally compile the template by calling Routine.compileEditExerciseTemplate() if the template exists on the page
// (It exists on the page because app/views/shared/_hs_templates.html.erb is rendered in my application.html.erb layout file)
// In Routine.compileEditExerciseTemplate function, I got the HTML string source of the <script id="edit-exercise-template">, 
// and then I passed this string HTML into Handlebars.compile()
// to compile the string HTML along w/ any Handlebars {{}} delimiters as part of a function stored as Routine.editExerciseTemplateFunction
// I can invoke this function, passing in an object whose key names correspond to the variables between the Handlebars delimiters in the template
// Set the variable mrHtml = Routine.editExerciseTemplateFunction(newMr), where newMr is the JS object I created with the JSON response I got back, which represents the instance of the MovementRoutine join model
// mrHtml is the string HTML edit form with all the values filled in
// Set this as the HTML content inside the <div id="edit-exercise-MOVEMENT ID HERE-div">
// In the DOM, replace the Edit Exercise link that was clicked with the actual edit form w/ technique, sets and reps values filled in
Routine.updateExercise = function() {
  $(document).on('submit', 'form.edit-mr', function(e) {
    e.preventDefault()
    var $form = $(this) // the <form> we're submitting (<form class="edit-mr-SPECIFIC MR ID HERE">)
    var action = $form.attr('action') // "/routines/:routine_id/movements/:movement_id"
    var movementId = action.split("/").pop() // .pop() removes and returns the last element in the array (movement's id value)
    $.ajax({
      url: action,
      method: 'patch',
      data: $form.serialize(),
      dataType: 'json'
    })
    .done(function(response) {
      var newMr = new MovementRoutine(response)
      // call a MovementRoutine formatter method here instead?
      var $setsParagraph = $(`p#move-${movementId}-sets`)
      $setsParagraph.html(`<strong>Sets</strong>: ${newMr.sets}`)
      var $repsParagraph = $(`p#move-${movementId}-reps`)
      $repsParagraph.html(`<strong>Reps</strong>: ${newMr.reps}`)
      var $techniqueParagraph = $(`p#move-${movementId}-technique`)
      $techniqueParagraph.html(newMr.technique)
      $form.hide()
      $(`a[data-id=${movementId}]`).show()
    })
  })
}
// The user types in new values for technique, sets and/or reps in the edit form
// Afterward, the user clicks Update Exercise form submit button
// Prevent the default submit action of the form, which would be a PATCH request to "/routines/:routine_id/movements/:movement_id"
// The response
Routine.handleEditExercise = function() {
  Routine.displayEditExerciseForm()
  Routine.updateExercise()
}

Routine.handleCancelEdit = function() {
  $(document).on('click', 'input.cancel-edit', function(e) {
    var movementRoutineId = $(this).data('mr-id')
    var movementId = $(this).data('movement-id')
    $(`form.edit-mr-${movementRoutineId}`).hide()
    $(`a[data-id=${movementId}]`).show()
  })
}


