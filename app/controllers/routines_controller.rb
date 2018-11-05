class RoutinesController < ApplicationController
  def new
  	@routine = Routine.new # instance for form_for to wrap around
  end

  def edit
  end

  private

  	def routine_params
      params.require(:routine).permit(
        :title,
        :difficulty_level,
        :duration,
        :user_id,
        :movements_attributes => [
          :name,
          :movement_routines => [:technique, :sets, :reps]
        ],
        :equipment_attributes => [
          :name,
          :equipment_routines => [:quantity, :weight]
        ],
        :targets_attributes => [:focus],
        :trainings_attributes => [:fitness_type]
      )
    end
end
