class TargetPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      user.trainer? ? scope.all : scope.none # Only trainers can see the index of all workout target areas
    end
  end

  def create?
    user.trainer? # Only trainers can create a new target area in the form found on the Index of Workout Target Areas
  end
end