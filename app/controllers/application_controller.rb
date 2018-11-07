class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  include Pundit
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  before_action :login_required, except: [:welcome]

  private

    def user_not_authorized(exception)
      policy_name = exception.policy.class.to_s.underscore
      flash[:alert] = t "#{policy_name}.#{exception.query}", scope: "pundit", default: :default
      redirect_to(request.referrer || root_path)
    end

    def current_user
      #@current_user ||= User.find(session[:user_id]) if session[:user_id]
      @current_user ||= User.find_by(id: session[:user_id]) # find_by returns the user instance or nil if session[:user_id] is nil
    end

    def logged_in?
      !!current_user # the truthiness of calling #current_user
    end

    def login_required # redirect to the homepage unless the user is logged in
      redirect_to root_url, alert: "You must be logged in to view this page!" unless logged_in?
    end

    helper_method :current_user, :logged_in? # makes methods accessible to views
end


