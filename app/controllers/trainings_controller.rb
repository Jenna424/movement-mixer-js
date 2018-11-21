class TrainingsController < ApplicationController
  def new
    @training_type = Training.new # instance for form_for to wrap around
    authorize @training_type
  end

  def index
    @training_types = policy_scope(Training)
    render json: @training_types
  end

  private

    def training_params
      params.require(:training).permit(:fitness_type)
    end
end
