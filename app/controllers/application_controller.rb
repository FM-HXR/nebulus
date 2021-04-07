class ApplicationController < ActionController::Base
  before_action :devise_permitted_params, if: :devise_controller?
  
  def find_user
    @user ||= current_user
  end

  def devise_permitted_params
    devise_parameter_sanitizer.permit(:sign_up, keys: [:username])
  end

end
