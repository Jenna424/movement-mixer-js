class MovementsController < ApplicationController
  def index
  	@movements = policy_scope(Movement) # same as Movement.all
  end
end
