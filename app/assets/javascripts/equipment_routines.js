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
  EquipmentRoutine.cancelEditListener()
  EquipmentRoutine.updateListener()
  EquipmentRoutine.destroyListener()
})
// The function below is called to display the EquipmentRoutine instance's edit form
EquipmentRoutine.editListener = function() {
  $('a.edit-er').on('click', function(e) {
    e.preventDefault()
    let id = $(this).data('id') // stores the id of the instance of EquipmentRoutine join model being edited
    $(this).hide() // once a.edit-er is clicked and I store its data-id attribute value in the id variable, hide the link
    $.get(`/ers/${id}/edit`)
      .done(EquipmentRoutine.displayEditForm)
      .fail(handleError)
  })
}
// Below, equipmentRoutineObject parameter = JSON object representation of the AR EquipmentRoutine instance for which I'm displaying the edit form.
EquipmentRoutine.displayEditForm = function(equipmentRoutineObject) {
  let newEquipmentRoutine = new EquipmentRoutine(equipmentRoutineObject)
  let editFormHtml = EquipmentRoutine.editEquipmentRoutineTemplateFunction(newEquipmentRoutine)
  let $editFormContainer = $(`#edit-er-${newEquipmentRoutine.id}-div`)
  $editFormContainer.html(editFormHtml)
  $editFormContainer.addClass('well well-md')
}

EquipmentRoutine.compileEditEquipmentRoutineTemplate = function() {
  EquipmentRoutine.editEquipmentRoutineTemplateSource = $('#edit-equipment-routine-template').html()
  EquipmentRoutine.editEquipmentRoutineTemplateFunction = Handlebars.compile(EquipmentRoutine.editEquipmentRoutineTemplateSource)
}
// <input type="button"> elements have no default behavior
EquipmentRoutine.cancelEditListener = function() {
  $('ul.required-equipment').on('click', 'input.cancel-editing-er', function(e) {
    let id = $(this).data('id')
    let $editFormContainer = $(`#edit-er-${id}-div`)
    let $editLink = $(`a[data-id=${id}]`)
    $editFormContainer.html('')
    $editFormContainer.removeClass('well well-md')
    $editLink.show()
  })
}

EquipmentRoutine.updateListener = function() {
  $('ul.required-equipment').on('submit', 'form.edit-er', function(e) {
    e.preventDefault()
    let action = $(this).attr('action') // "/ers/:id", which maps to routines#update_equipment_routine
    let formData = $(this).serialize()
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
// Below, equipmentRoutineObject parameter = JSON object representation of EquipmentRoutine join table instance with quantity and weight key/value pairs updated = successful JSON response I get back from AJAX PATCH request sent in EquipmentRoutine.updateListener()
EquipmentRoutine.update = function(equipmentRoutineObject) {
  let newEr = new EquipmentRoutine(equipmentRoutineObject)
  newEr.formatQuantityAndWeight()
  manyToManyModificationMessage(newEr) // this function is declared in shared.js
}
// Below, this refers to the newEr object on which I'm calling prototype method formatQuantityAndWeight()
EquipmentRoutine.prototype.formatQuantityAndWeight = function() {
  let id = this.id
  let $smallQuantity = $(`small#quantity-${id}`)
  let $smallWeight = $(`small#weight-${id}`)
  let weightText = ''
  if (this.weight === null) { // if weight is null
    weightText = 'N/A'
  } else {
    weightText = `${this.weight} lb(s) each`
  }
  $smallQuantity.html(`<strong>Quantity</strong>: ${this.quantity}`)
  $smallWeight.html(`<strong>Weight</strong>: ${weightText}`)
}

EquipmentRoutine.destroyListener = function() {
  $('ul.required-equipment').on('submit', 'form.button_to', function(e) {
    e.preventDefault()
    if (confirm('Are you sure you want to remove this piece of equipment?')) {
      $.ajax({
        url: $(this).attr('action'), // '/ers/:id'
        method: 'DELETE',
        dataType: 'json',
        data: $(this).serialize()
      })
        .done(EquipmentRoutine.destroy)
        .fail(handleError)
    }
  })
}
// Below, equipmentRoutineObject parameter = JSON object representation of the A.R. EquipmentRoutine join model instance that was just destroyed = successful JSON response I get back from the AJAX DELETE request sent in EquipmentRoutine.destroyListener()
EquipmentRoutine.destroy = function(equipmentRoutineObject) {
  let newEr = new EquipmentRoutine(equipmentRoutineObject)
  newEr.eliminateLi() // calling eliminateLi() prototype method on newEr object
}
// Below, this refers to the newEr object on which I'm calling prototype method .eliminateLi()
EquipmentRoutine.prototype.eliminateLi = function() {
  let id = this.id
  $(`#er-${id}-li`).remove()
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
