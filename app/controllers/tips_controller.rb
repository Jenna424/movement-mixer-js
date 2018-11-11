class TipsController < ApplicationController
  def create # POST '/movements/:movement_id/tips' => 'tips#create'
    @movement = Movement.find(params[:movement_id]) # finding the parent movement instance
    @tip = @movement.tips.build(tip_params)
    authorize @tip
    if @tip.save
      render json: @tip
    else
      render "movements/show" # Exercise movement show page contains form to try creating a training tip guide belonging to that exercise movement again
    end
  end

  private

    def tip_params
      params.require(:tip).permit(
        :proper_form,
        :breathing_technique,
        :modification,
        :challenge,
        :movement_id,
        :user_id
      )
    end
end