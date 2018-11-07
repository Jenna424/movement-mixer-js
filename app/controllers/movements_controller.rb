class MovementsController < ApplicationController
  def index
  	@movements = policy_scope(Movement)
  	render json: @movements
  end

  def edit # get '/routines/:routine_id/movements/:movement_id/edit' => 'movements#edit'
  end

  def update # PATCH "/routines/:routine_id/movements/:movement_id" => 'movements#update'
  end

  def destroy # DELETE "/routines/:routine_id/movements/:movement_id" => 'movements#destroy'
  end

  def show
  	@movement = Movement.find(params[:id])
  	respond_to do |format|
  	  format.html
  	  format.json {render json: @movement}
  	end
  end
end
