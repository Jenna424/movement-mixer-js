class TargetsController < ApplicationController
  def new
  	@target_area = Target.new # instance for form_for to wrap around
  end

  private

  	def target_params
  	  params.require(:target).permit(:focus)
  	end
end
