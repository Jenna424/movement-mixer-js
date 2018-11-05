class RoutinesController < ApplicationController
  def index
    @routines = Routine.all
    render json: @routines
  end
  
  def new
	  @routine = Routine.new # instance for form_for to wrap around
	  @routine.movements.build
	  @routine.equipment.build
	  @routine.targets.build
	  @routine.trainings.build
  end

  def create
    @routine = current_user.routines.build(routine_params)
    if @routine.save
      render json: @routine
    else
      render :new
    end
  end

  def show
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
          :movement_routines => [:reps, :sets, :technique]
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
