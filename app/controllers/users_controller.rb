class UsersController < ApplicationController
  def new
    @user = User.new # instance for form_for to wrap around
  end

  def edit
  end
end
