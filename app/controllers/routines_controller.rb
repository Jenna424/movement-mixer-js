class RoutinesController < ApplicationController
  def new
  	@routine = Routine.new # instance for form_for to wrap around
  end

  def edit
  end
end
