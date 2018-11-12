class MovementsController < ApplicationController
  before_action :set_movement, only: [:show, :next, :previous]

  def index
  	@movements = policy_scope(Movement)
  	render json: @movements
  end

  def edit # GET '/routines/:routine_id/movements/:movement_id/edit' => 'movements#edit'
  end

  def update # PATCH "/routines/:routine_id/movements/:movement_id" => 'movements#update'
  end

  def destroy # DELETE "/routines/:routine_id/movements/:movement_id" => 'movements#destroy'
  end

  def show # @movement is retrieved from before_action :set_movement
    @guide = Guide.new
  	respond_to do |format|
  	  format.html
  	  format.json {render json: @movement}
  	end
  end

  def next # @movement is retrieved from before_action :set_movement
    @next_move = @movement.next
    render json: @next_move
  end

  private

    def set_movement
      @movement = Movement.find(params[:id])
    end
end