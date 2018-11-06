class MovementsController < ApplicationController
  def index
  	@movement = policy_scope(Movement) # same as Movement.all
  end
end
