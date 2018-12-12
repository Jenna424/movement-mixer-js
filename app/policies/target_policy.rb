class TargetPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      user.trainer? ? scope.all : scope.none # Only trainers can see the index of all workout target areas
    end
  end
end