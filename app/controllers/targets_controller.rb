class TargetsController < ApplicationController
  def new
    @target_area = Target.new # instance for form_for to wrap around
    authorize @target_area
  end

  def index
    @target_areas = policy_scope(Target)
    render json: @target_areas
  end

  def create
  	target_area = Target.new(target_params)
  	if target_area.save
  	  render json: target_area, status: 201
    else
      render json: { errors: target_area.errors.full_messages }, status: :unprocessable_entity # status: 422
    end
  end

  def destroy
    target_area = Target.find(params[:id])
    target_area.destroy
    render json: target_area
  end

  private

    def target_params
      params.require(:target).permit(:focus)
    end
end