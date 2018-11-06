class MovementsController < ApplicationController
  def index
  	@movements = policy_scope(Movement) # same as Movement.all
  	render json: @movements
  end
end
