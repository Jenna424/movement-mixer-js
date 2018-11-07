class MovementsController < ApplicationController
  def index
  	@movements = policy_scope(Movement)
  	render json: @movements
  end

  def show
  	@movement = Movement.find(params[:id])
  	respond_to do |format|
  	  format.html
  	  format.json {render json: @movement}
  	end
  end
end
