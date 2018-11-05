class UsersController < ApplicationController
  skip_before_action :login_required, only: [:new, :create]

  def new
    @user = User.new # instance for form_for to wrap around
  end

  def create
    @user = User.new(user_params)
    if @user.save
      session[:user_id] = @user.id # log in the user
      redirect_to user_path(@user), flash: { success: "You successfully registered and created your preliminary profile, #{current_user.name}!" }
    else
      flash.now[:error] = "Your registration attempt was unsuccessful. Please try again."
      render :new # present the registration form so the user can try signing up again
    end
  end

  private

  def user_params
    params.require(:user).permit(
      :name,
      :email,
      :password,
      :password_confirmation,
      :role_requested,
      :role,
      :trainer_id
    )
  end
end
