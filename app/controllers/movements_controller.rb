class MovementsController < ApplicationController
  before_action :set_movement, only: [:show, :next, :previous]

  def index
    movements = Movement.all # unassigned users, clients, trainers and admins can all view the Index of Exercise Movements
    render json: movements, status: 200
  end

  def show # @movement is retrieved from before_action :set_movement
    @guide = Guide.new # instance for nested resource form to wrap around
    respond_to do |format|
      format.html
      format.json { render json: @movement, status: 200 }
    end
  end

  def next # @movement is retrieved from before_action :set_movement
    next_move = @movement.next
    render json: next_move, status: 200
  end

  def previous # @movement is retrieved from before_action :set_movement
    previous_move = @movement.previous
    render json: previous_move, status: 200
  end

  def show_technique # get '/mrs/:id' => 'movements#show_technique'
    mr = MovementRoutine.find(params[:id])
    render json: mr, status: 200
  end

  private

    def set_movement
      @movement = Movement.find(params[:id])
    end
end