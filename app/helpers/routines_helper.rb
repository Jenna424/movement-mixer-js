module RoutinesHelper
  def mr_instance(movement, routine)
  	MovementRoutine.find_by(movement: movement, routine: routine)
  end
end