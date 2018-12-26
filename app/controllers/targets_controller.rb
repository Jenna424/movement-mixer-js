class TargetsController < ApplicationController
  def new
    @target_area = Target.new # instance for form_for to wrap around
    authorize @target_area
  end

  def create
    target_area = Target.new(target_params)
    authorize target_area

  	if target_area.save
  	  render json: target_area, status: 201
    else
      render json: { errors: target_area.errors.full_messages }, status: :unprocessable_entity # status: 422
    end
  end

  def index
    target_areas = policy_scope(Target)
    render json: target_areas, status: 200
  end

  def destroy # delete '/targets/:id' => 'targets#destroy'
    target_area = Target.find(params[:id])
    authorize target_area # Any trainer can delete any target area
    target_area.destroy
    render json: target_area, status: 200
  end

  private

    def target_params
      params.require(:target).permit(:focus)
    end
end