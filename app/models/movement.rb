class Movement < ApplicationRecord
  has_many :guides, dependent: :destroy
  has_many :movement_routines, dependent: :destroy
  has_many :routines, through: :movement_routines

  # Instance method #position_in_routine(routine) is called on a movement instance (self)
  # to find its numeric position in the specified routine passed in as the method's argument
  def position_in_routine(routine)
  	movements_in_routine = Movement.joins(:routines).where(routines: { id: routine }).distinct
  	movements_in_routine.find_index(self).to_i + 1
  end

  def display_technique(routine)
  	self.movement_routines.find_by(routine: routine).technique
  end

  def next
    movement = Movement.where("id > ?", id).first
    movement ? movement : Movement.first
  end

  def previous
    movement = Movement.where("id < ?", id).first
    movement ? movement : Movement.first
  end

end