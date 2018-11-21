class TargetPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      if user.trainer? # Only trainers can see the index of all workout target areas (which contains delete buttons)
        scope.all
      else
        scope.none
      end
    end
  end
end