class TrainingsController < ApplicationController
  def new
    @training_type = Training.new
  end

  private

    def training_params
      params.require(:training).permit(:fitness_type)
    end
end
