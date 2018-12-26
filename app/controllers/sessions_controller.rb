class SessionsController < ApplicationController
  skip_before_action :login_required, only: [:new, :create]
  before_action :prevent_logged_in_user_from_viewing_login_form, only: [:new]

  def new # implicitly renders app/views/sessions/new.html.erb (login form template)
  end

  def create # receives data submitted in login form, authenticates and logs in a valid user
    @user = User.find_by(email: params[:email])
    if @user && @user.authenticate(params[:password])
      session[:user_id] = @user.id # log in the user
      redirect_to user_path(@user), flash: { success: "You successfully logged in! Welcome back to Movement Mixer, #{@user.name}!" }
    else # present login form so user can try logging in again
      flash.now[:error] = "Your login attempt was unsuccessful. Please enter a valid email and password combination."
      render :new
    end
  end

  def destroy # logging out the user
    session.clear # session[:user_id] = nil
    redirect_to root_url, flash: { success: "Thanks for using Movement Mixer! Goodbye for now." }
  end

  private

    def prevent_logged_in_user_from_viewing_login_form
      redirect_to root_path, alert: "You cannot view the login form since you're already logged in!" if current_user
    end
end

