class MovementPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      if user.client? || user.trainer? || user.admin? || user.unassigned?
        scope.all
      else
        scope.none
      end
    end
  end

  def show?
  	if user.client? || user.trainer? || user.admin?
  	  scope.all
  	else
  	  scope.none
  	end
  end
end