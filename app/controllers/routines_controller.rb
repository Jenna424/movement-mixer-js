class RoutinesController < ApplicationController
  before_action :set_routine, only: [:show, :edit, :update, :destroy]

  def show_technique # get '/mrs/:id' => 'routines#show_technique'
    @mr = MovementRoutine.find(params[:id])
    render json: @mr
  end

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
    respond_to do |format|
      format.html
      format.json { render json: @routine }
    end
  end

  def edit
  end

  def update
    if @routine.update(routine_params)
      redirect_to routine_path(@routine), notice: "The workout routine was successfully updated!"
    else
      render :edit
      flash.now[:error] = "Your attempt to edit this workout routine was unsuccessful. Please try again."
    end
  end

  def edit_movement_routine # GET '/routines/:routine_id/movements/:movement_id/edit' => 'routines#edit_movement_routine'
    movement_routine = MovementRoutine.find_by(routine: params[:routine_id], movement: params[:movement_id])
    render json: movement_routine
  end

  def update_movement_routine # PATCH '/routines/:routine_id/movements/:movement_id' => 'routines#update_movement_routine'
    movement_routine = MovementRoutine.find_by(routine: params[:routine_id], movement: params[:movement_id])
    mr_id = movement_routine.id.to_s
    movement_routine.reps = params['routine']['movements_attributes'][mr_id]['movement_routines']['reps']
    movement_routine.sets = params['routine']['movements_attributes'][mr_id]['movement_routines']['sets']
    movement_routine.technique = params['routine']['movements_attributes'][mr_id]['movement_routines']['technique']
    if movement_routine.save
      render json: movement_routine
    else
      flash.now[:error] = "Your attempt to edit the #{movement_routine.movement.name} was unsuccessful. Please try again."
    end
  end

  def destroy_movement_routine # DELETE '/routines/:routine_id/movements/:movement_id' => 'routines#destroy_movement_routine'
    movement_routine = MovementRoutine.find_by(routine: params[:routine_id], movement: params[:movement_id])
    movement_routine.destroy
    respond_to do |f|
      f.html { redirect_to routine_path(params[:routine_id])}
      f.json { render json: movement_routine} # render JSON object representation of the MovementRoutine join model instance that was just deleted
    end
  end

  private

    def set_routine
      @routine = Routine.find(params[:id])
    end

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
        :target_ids => [],
        :training_ids => []
      )
    end
end
