module RoutinesHelper
  def mr_instance(movement, routine)
    MovementRoutine.find_by(movement: movement, routine: routine)
  end

  def er_instance(equipment, routine)
    EquipmentRoutine.find_by(equipment: equipment, routine: routine)
  end

  def display_equipment_for(routine)
    routine.equipment.empty? ? "None" : routine.equipment.map{|e| e.name}.uniq.join(", ")
  end
end