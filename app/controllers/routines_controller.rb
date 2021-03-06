class RoutinesController < ApplicationController
  before_action :set_routine, only: [:show, :edit, :update, :destroy]

  def index # Unassigned users, clients and admins view all workouts. A trainer only views routines designed by her clients.
    routines = policy_scope(Routine)
    render json: routines, status: 200
  end
  
  def new
    @routine = Routine.new # instance for form_for to wrap around
    authorize @routine # only let clients view the form to create a new routine
    @routine.movements.build # create a blank movement for nested fields_for :movements
    @routine.equipment.build # create a blank equipment for nested fields_for :equipment
  end

  def create
    routine = current_user.routines.build(routine_params)
    authorize routine

    if routine.save
      render json: routine, status: 201 # indicates that a new routine resource was successfully created
    else
      render json: { errors: routine.errors.full_messages }, status: :unprocessable_entity # status: 422
    end
  end

  def show
    respond_to do |format|
      format.html
      format.json { render json: @routine, status: 200 }
    end
  end

  def edit # Only the client who created a routine & that client's trainer can view the form to edit that routine
    authorize @routine
  end

  def update
    if !params[:routine][:title].blank? || !params[:routine][:duration].blank? || !params[:routine][:difficulty_level].blank? || !params[:routine][:target_ids].blank? || !params[:routine][:training_ids].blank? # User is updating any of the following attributes on the Edit Routine page: title, difficulty_level, duration, target_ids, training_ids
      if @routine.update(routine_params)
        redirect_to routine_path(@routine), notice: "The workout routine was successfully updated!"
      else
        flash.now[:error] = "Your attempt to revise this routine was unsuccessful. Please try again."
        render :edit
      end
    else
      if @routine.update(routine_params)
        if request.referrer == "http://localhost:3000/routines/#{@routine.id}/edit" # User is updating equipment used in the workout on the Edit Routine page
          last_updated_er = @routine.equipment_routines.order(:updated_at).last
          render json: last_updated_er, status: 200
        elsif request.referrer == "http://localhost:3000/routines/#{@routine.id}" # User is updating exercise movements performed in the workout on the Routine Show page
          last_updated_mr = @routine.movement_routines.order(:updated_at).last
          render json: last_updated_mr, status: 200
        end
      end
    end
  end

  def edit_movement_routine # get '/mrs/:id/edit' => 'routines#edit_movement_routine'
    movement_routine = MovementRoutine.find(params[:id])
    render json: movement_routine, status: 200
  end

  def update_movement_routine # patch '/mrs/:id' => 'routines#update_movement_routine'
    movement_routine = MovementRoutine.find(params[:id])
    mr_id = params[:id]
    movement_routine.reps = params['routine']['movements_attributes'][mr_id]['movement_routines']['reps']
    movement_routine.sets = params['routine']['movements_attributes'][mr_id]['movement_routines']['sets']
    movement_routine.technique = params['routine']['movements_attributes'][mr_id]['movement_routines']['technique']
    if movement_routine.save
      render json: movement_routine, status: 200
    else
      render json: { errors: movement_routine.errors.full_messages }, status: :unprocessable_entity # status code 422
    end
  end

  def destroy_movement_routine # delete '/mrs/:id' => 'routines#destroy_movement_routine'
    movement_routine = MovementRoutine.find(params[:id])
    movement_routine.destroy
    render json: movement_routine, status: 200
  end

  def edit_equipment_routine # get '/ers/:id/edit' => 'routines#edit_equipment_routine'
    equipment_routine = EquipmentRoutine.find(params[:id])
    render json: equipment_routine, status: 200
  end

  def update_equipment_routine # patch '/ers/:id' => 'routines#update_equipment_routine'
    equipment_routine = EquipmentRoutine.find(params[:id])
    er_id = params[:id]
    equipment_routine.quantity = params['routine']['equipment_attributes'][er_id]['equipment_routines']['quantity']
    equipment_routine.weight = params['routine']['equipment_attributes'][er_id]['equipment_routines']['weight']
    if equipment_routine.save
      render json: equipment_routine, status: 200
    else
      render json: { errors: equipment_routine.errors.full_messages }, status: :unprocessable_entity # status code 422
    end
  end

  def destroy_equipment_routine # delete '/ers/:id' => 'routines#destroy_equipment_routine'
    equipment_routine = EquipmentRoutine.find(params[:id])
    equipment_routine.destroy
    render json: equipment_routine, status: 200
  end

  def destroy # delete '/routines/:id' => 'routines#destroy'
    authorize @routine # Only the client who created the routine can delete that routine
    @routine.destroy
    render json: @routine, status: 200
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
