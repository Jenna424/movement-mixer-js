function EquipmentRoutine(equipmentRoutine) {
  this.id = equipmentRoutine.id
  this.equipment = equipmentRoutine.equipment
  this.routine = equipmentRoutine.routine
  this.quantity = equipmentRoutine.quantity
  this.weight = equipmentRoutine.weight
}

$(function() {
  EquipmentRoutine.editListener()
})

EquipmentRoutine.compileEditEquipmentRoutineTemplate = function() {
  EquipmentRoutine.editEquipmentRoutineTemplateSource = $('#edit-equipment-routine-template').html()
  EquipmentRoutine.editEquipmentRoutineTemplateFunction = Handlebars.compile(EquipmentRoutine.editEquipmentRoutineTemplateSource)
}