class UsersController < ApplicationController
  before_action :set_user, only: [:show, :edit, :update, :destroy]
  skip_before_action :login_required, only: [:new, :create]

  def index
    authorize current_user
    users = policy_scope(User)
    render json: users, status: 200
  end

  def new
    @user = User.new # instance for form_for to wrap around
    authorize @user
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

  def show
    authorize @user
    respond_to do |format|
      format.html
      format.json { render json: @user, include: ['routines.equipment', 'routines.targets', 'routines.trainings', 'routines.user', 'guides.user', 'guides.movement'] }
    end
  end

  def edit
    authorize @user
  end

  def update
    authorize @user # retrieved from before_action :set_user
    if current_user.admin? && @user.unassigned? && params[:user][:role] != "unassigned"
      if @user.update_attributes(permitted_attributes(@user))
        redirect_to accounts_path, flash: { success: "#{@user.name} was successfully assigned the role of #{@user.role}!" }
      end
    elsif current_user.admin? && @user.trainer.nil? && !params[:user][:trainer_id].nil?
      if @user.update_attributes(permitted_attributes(@user))
        redirect_to accounts_path, flash: { success: "Personal Trainer #{User.by_role("trainer").find(params[:user][:trainer_id]).name} is now helping #{@user.name} achieve fitness goals!" }
      end
    elsif @user.update_attributes(permitted_attributes(@user))
      redirect_to user_path(@user), flash: { success: "User information was successfully updated!" }
    else
      flash.now[:error] = "Your attempt to edit user information was unsuccessful. Please try again."
      render :edit
    end
  end

  def destroy
    authorize @user # retrieved from before_action :set_user
    @user.destroy
    render json: @user, status: 200
  end

  def accounts
    authorize current_user
    @users = User.all
    @trainers = User.by_role("trainer") # used when admin assigns trainer to client
    @future_clients = User.all.awaiting_assignment("trainer", 1)
    @future_trainers = User.all.awaiting_assignment("client", 2)
  end

  private

    def set_user
      @user = User.find(params[:id])
    end

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
