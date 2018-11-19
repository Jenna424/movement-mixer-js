function EquipmentRoutine(equipmentRoutine) {
  this.id = equipmentRoutine.id
  this.equipment = equipmentRoutine.equipment
  this.routine = equipmentRoutine.routine
  this.quantity = equipmentRoutine.quantity
  this.weight = equipmentRoutine.weight
}

$(function() {
  EquipmentRoutine.editListener()
  EquipmentRoutine.updateListener()
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
  	  $editDiv.addClass('well well-md')
  	  $editEquipmentLink.hide()
  	})
  })
}

EquipmentRoutine.updateListener = function() {
  $('ul.required-equipment').on('submit', 'form.edit-er', function(e) {
    e.preventDefault()
    var $editEquipmentForm = $(this)
    var action = $editEquipmentForm.attr('action') // "/ers/:id", which maps to routines#update_equipment_routine
    var erId = action.split('/')[2]
    var $smallQuantity = $(`small#quantity-${erId}`)
    var $smallWeight = $(`small#weight-${erId}`)
    $.ajax({
      url: action,
      method: 'patch',
      dataType: 'json',
      data: $editEquipmentForm.serialize()
    })
    .done(function(response){ // response is JSON object representation of EquipmentRoutine join table instance with quantity and weight key/value pairs updated
      var newEr = new EquipmentRoutine(response)
      newEr.formatQuantityAndWeight()
    })
  })
}
