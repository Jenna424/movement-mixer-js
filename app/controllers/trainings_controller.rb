class TrainingsController < ApplicationController
  def new
    @training_type = Training.new # instance for form_for to wrap around
    authorize @training_type
  end

  def create
    training_type = Training.new(training_params)
    authorize training_type
    
    if training_type.save
      render json: training_type, status: 201
    else
      render json: { errors: training_type.errors.full_messages }, status: :unprocessable_entity # status: 422
    end
  end

  def index
    training_types = policy_scope(Training)
    render json: training_types, status: 200
  end

  def destroy # delete '/trainings/:id' => 'trainings#destroy'
    training_type = Training.find(params[:id])
    authorize training_type
    training_type.destroy
    render json: training_type, status: 200
  end

  private

    def training_params
      params.require(:training).permit(:fitness_type)
    end
end