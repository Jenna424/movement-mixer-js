class MovementsController < ApplicationController
  def index
  	@movements = policy_scope(Movement)
  	render json: @movements
  end
end
