class UserPolicy < ApplicationPolicy
  def new?
  	true unless user
  end
end