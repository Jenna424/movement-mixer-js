class MovementsController < ApplicationController
  before_action :set_movement, only: [:show, :next, :previous]

  def index
  	@movements = policy_scope(Movement)
  	render json: @movements
  end

  def show # @movement is retrieved from before_action :set_movement
    @guide = Guide.new # instance for form to wrap around
    render json: @movement, status: 200
  end

  def next # @movement is retrieved from before_action :set_movement
    @next_move = @movement.next
    render json: @next_move
  end

  def previous # @movement is retrieved from before_action :set_movement
    @previous_move = @movement.previous
    render json: @previous_move
  end

  private

    def set_movement
     @movement = Movement.find(params[:id])
    end
end
