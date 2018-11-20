class TargetsController < ApplicationController
  def new
    @target_area = Target.new # instance for form_for to wrap around
  end

  def index
    @target_area = Target.new # instance for form_for to wrap around
    @target_areas = Target.all
    render json: @target_areas
  end

  def create
  	@target_area = Target.new(target_params)
  	if @target_area.save
  	  render json: @target_area
  	end
  end

  private

    def target_params
      params.require(:target).permit(:focus)
    end
end