function EquipmentRoutine(equipmentRoutine) {
  this.id = equipmentRoutine.id
  this.equipment = equipmentRoutine.equipment
  this.routine = equipmentRoutine.routine
  this.quantity = equipmentRoutine.quantity
  this.weight = equipmentRoutine.weight
}

$(function() {
  EquipmentRoutine.editListener()
  EquipmentRoutine.handleEditCancellation()
  EquipmentRoutine.updateListener()
  EquipmentRoutine.destroyListener()
})

EquipmentRoutine.compileEditEquipmentRoutineTemplate = function() {
  EquipmentRoutine.editEquipmentRoutineTemplateSource = $('#edit-equipment-routine-template').html()
  EquipmentRoutine.editEquipmentRoutineTemplateFunction = Handlebars.compile(EquipmentRoutine.editEquipmentRoutineTemplateSource)
}

EquipmentRoutine.editListener = function() {
  $('ul.required-equipment').on('click', 'a.edit-equipment', function(e) {
  	e.preventDefault()
  	var $editEquipmentLink = $(this)
  	var erId = $(this).data('er-id') // stores the id of the instance of EquipmentRoutine join model being edited
  	var $editDiv = $(`div#edit-er-${erId}-div`)
  	$.get(`/ers/${erId}/edit`)
  	.done(function(response) {
  	  var newEr = new EquipmentRoutine(response)
  	  var editFormHtml = EquipmentRoutine.editEquipmentRoutineTemplateFunction(newEr)
  	  $editDiv.html(editFormHtml)
      $editDiv.show()
      $editDiv.addClass('well well-md')
  	  $editEquipmentLink.hide()
  	})
  })
}

EquipmentRoutine.handleEditCancellation = function() {
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
    var $editEquipmentForm = $(this)
    var action = $editEquipmentForm.attr('action') // "/ers/:id", which maps to routines#update_equipment_routine
    $.ajax({
      url: action,
      method: 'patch',
      dataType: 'json',
      data: $editEquipmentForm.serialize()
    })
    .done(EquipmentRoutine.update)
    $editEquipmentForm.find('input[type=number]').val(''); // empty the number fields in the form to edit quantity & weight
  })
}

EquipmentRoutine.update = function(json) { // json parameter = JSON object representation of EquipmentRoutine join table instance with quantity and weight key/value pairs updated = response from AJAX PATCH request made in EquipmentRoutine.updateListener()
  var newEr = new EquipmentRoutine(json)
  newEr.formatQuantityAndWeight()
}

EquipmentRoutine.prototype.formatQuantityAndWeight = function() {
  var erId = this.id
  var $smallQuantity = $(`small#quantity-${erId}`)
  var $smallWeight = $(`small#weight-${erId}`)
  $smallQuantity.html(`<strong>Quantity</strong>: ${this.quantity}`)
  $smallWeight.html(`<strong>Weight</strong>: ${this.weight} lb(s) each`)
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
