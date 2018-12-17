function EquipmentRoutine(equipmentRoutine) {
  this.id = equipmentRoutine.id
  this.equipment = equipmentRoutine.equipment
  this.routine = equipmentRoutine.routine
  this.quantity = equipmentRoutine.quantity
  this.weight = equipmentRoutine.weight
}
// div#equipment-errors-explanation is always found in the form to add a piece of equipment to the routine, which, in turn, is always found in app/views/routines/edit.html.erb
EquipmentRoutine.displayValidationCriteria = function() {
  $('div#equipment-errors-explanation').html(
    `<div class="alert alert-danger" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
      <h4 class="alert-heading">Your attempt to add a piece of equipment was unsuccessful.</h4>
      <div>
        <strong>Please provide the following information</strong>:
        <ul>
          <li>Type of equipment</li>
          <li>Quantity required (must be greater than 0)</li>
        </ul>
      </div>
      <div>
        <strong>Include the data below, if applicable</strong>:
        <ul>
          <li>Weight of equipment (must be greater than 0 lbs)</li>
        </ul>
      </div>
      <hr>
      <small class="mb-0"><em>Please note: equipment details will be overwritten if duplicate data is submitted.</em></small>
    </div>`
  )
}

EquipmentRoutine.isValidObject = function(equipmentName, quantity, weight) {
  if (weight) { // if weight is NOT null (i.e. user submitted weight in number_field)
    if (!equipmentName.trim().length || !(parseInt(quantity) > 0) || !(parseInt(weight) > 0)) {
      EquipmentRoutine.displayValidationCriteria()
      return false
    } else {
      return true
    }
  } else { // weight = null (i.e. weight was NOT submitted in number_field)
    if (!equipmentName.trim().length || !(parseInt(quantity) > 0)) {
      EquipmentRoutine.displayValidationCriteria()
      return false
    } else {
      return true
    }
  }
}

$(() => {
  EquipmentRoutine.editListener()
  EquipmentRoutine.editCancellationListener()
  EquipmentRoutine.updateListener()
  EquipmentRoutine.destroyListener()
})

EquipmentRoutine.editListener = function() {
  $('a.edit-equipment').on('click', function(e) {
    e.preventDefault()
    let $editEquipmentLink = $(this)
    let erId = $(this).data('er-id') // stores the id of the instance of EquipmentRoutine join model being edited
    let $editDiv = $(`div#edit-er-${erId}-div`)
    $.get(`/ers/${erId}/edit`)
    .done(function(response) {
      let newEr = new EquipmentRoutine(response)
      let editFormHtml = EquipmentRoutine.editEquipmentRoutineTemplateFunction(newEr)
      $editDiv.html(editFormHtml)
      $editDiv.show()
      $editDiv.addClass('well well-md')
      $editEquipmentLink.hide()
    })
  })
}

EquipmentRoutine.compileEditEquipmentRoutineTemplate = function() {
  EquipmentRoutine.editEquipmentRoutineTemplateSource = $('#edit-equipment-routine-template').html()
  EquipmentRoutine.editEquipmentRoutineTemplateFunction = Handlebars.compile(EquipmentRoutine.editEquipmentRoutineTemplateSource)
}

EquipmentRoutine.editCancellationListener = function() {
  $('ul.required-equipment').on('click', 'input.cancel-er-edit', function(e) {
    var erId = $(this).data('er-id')
    var $editFormContainer = $(`div#edit-er-${erId}-div`)
    var $editLink = $(`a[data-er-id=${erId}]`)
    $editFormContainer.hide()
    $editLink.show()
  })
}

EquipmentRoutine.updateListener = function() {
  $('ul.required-equipment').on('submit', 'form.edit-er', function(e) {
    e.preventDefault()
    var action = $(this).attr('action') // "/ers/:id", which maps to routines#update_equipment_routine
    var formData = $(this).serialize()
    $(this).find('input[type=number]').val(''); // empty the number fields in the form to edit quantity & weight
    $.ajax({
      url: action,
      method: 'PATCH',
      dataType: 'json',
      data: formData
    })
    .done(EquipmentRoutine.update)
    .fail(checkValidityOfJoinTableAttrs)
  })
}

EquipmentRoutine.update = function(json) { // json parameter = JSON object representation of EquipmentRoutine join table instance with quantity and weight key/value pairs updated = response from AJAX PATCH request made in EquipmentRoutine.updateListener()
  var newEr = new EquipmentRoutine(json)
  newEr.formatQuantityAndWeight()
  addAssociationAlert(newEr)
}

EquipmentRoutine.prototype.formatQuantityAndWeight = function() {
  var erId = this.id
  var $smallQuantity = $(`small#quantity-${erId}`)
  var $smallWeight = $(`small#weight-${erId}`)
  var weightText = ''
  if (this.weight === null) { // if weight is null
    weightText = 'N/A'
  } else {
    weightText = `${this.weight} lb(s) each`
  }
  $smallQuantity.html(`<strong>Quantity</strong>: ${this.quantity}`)
  $smallWeight.html(`<strong>Weight</strong>: ${weightText}`)
}

EquipmentRoutine.destroyListener = function() {
  $('ul.required-equipment').on('click', 'form.button_to', function(e) {
    e.preventDefault()
    if (confirm('Are you sure you want to remove this piece of equipment?')) {
      $.ajax({
        url: $(this).attr('action'), // '/ers/:id'
        method: 'delete',
        dataType: 'json',
        data: $(this).serialize()
      })
      .done(EquipmentRoutine.destroy)
    } else {
      console.log("The user did not confirm deletion of this piece of equipment")
    }
  })
}

EquipmentRoutine.destroy = function(json) { // json parameter of EquipmentRoutine.destroy function = JSON object representation of the A.R. EquipmentRoutine join model instance that was just destroyed = the JSON response I get back from the AJAX DELETE request made in EquipmentRoutine.destroyListener()
  var newEr = new EquipmentRoutine(json)
  newEr.eliminateLi() // calling eliminateLi() prototype method on newEr object
}

EquipmentRoutine.prototype.eliminateLi = function() {
  var erId = this.id // this refers to the newEr JSON object on which I'm calling prototype method .eliminateLi()
  $(`#er-${erId}-li`).remove()
}

EquipmentRoutine.compileErTemplate = function() {
  EquipmentRoutine.erTemplateSource = $('#er-template').html()
  EquipmentRoutine.erTemplateFunction = Handlebars.compile(EquipmentRoutine.erTemplateSource)
}

// The json parameter below is the JSON object representation of the EquipmentRoutine instance 
// (with data about the routine and equipment instances to which it belongs). 
// This JSON object representation of the EquipmentRoutine instance = response to AJAX PATCH request made in Routine.addEquipmentListener()

EquipmentRoutine.addEquipmentToRoutine = function(json) {
  var newEr = new EquipmentRoutine(json)
  var match = $("li[id^='er']").filter(function() {
    return this.id === `er-${newEr.id}-li`
  })
  if (match.length) { // I'm updating an existing EquipmentRoutine instance, which already has an <li>
    newEr.formatQuantityAndWeight()
  } else { // An entirely new piece of equipment was submitted, so a new <li> needs to be appended to the <ul>
    newEr.formatAndAppendLi()
  }
  addAssociationAlert(newEr)
}

EquipmentRoutine.prototype.formatAndAppendLi = function() {
  var $equipmentList = $('ul.required-equipment') // get the <ul> that contains all of the equipment used in the routine
  var erLiHtml = EquipmentRoutine.erTemplateFunction(this) // store the Handlebars template w/ values injected from key/value pairs of newEr object (this)
  $equipmentList.append(erLiHtml) // appending the <li> for the new equipment to the <ul> containing all equipment used in the routine 
}
