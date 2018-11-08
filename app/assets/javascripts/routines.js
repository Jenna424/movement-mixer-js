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
  Routine.handleShowFullTechnique()
  Routine.handleHideTechnique()
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
      $('#new_routine').find('input[type=text], textarea').val('');
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
    history.replaceState(null, null, "routines")
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
Routine.handleShowFullTechnique = function() {
  $('div.panel-default').on('click', '.js-show-technique', function(e) {
    e.preventDefault();
    var $button = $(this); // $button stores the button that was clicked
    console.log($button)
    var routineId = $(this).data('routine-id')
    var movementId = $(this).data('movement-id')
    $.get(`/routines/${routineId}.json`)
    .done(function(response) {
      $button.hide()
      //$(`button[data-movement-id='${movementId}']`).hide();
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
    e.preventDefault()
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