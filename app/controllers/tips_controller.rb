class TipsController < ApplicationController

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
