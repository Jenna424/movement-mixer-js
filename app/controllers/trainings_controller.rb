class TrainingsController < ApplicationController
  def new
    @training_type = Training.new # instance for form_for to wrap around
    authorize @training_type
  end

  def create
    training_type = Training.new(training_params)
    if training_type.save
      render json: training_type, status: :created # status: 201
    else
      render json: { errors: training_type.errors.full_messages }, status: :unprocessable_entity # status: 422
    end
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