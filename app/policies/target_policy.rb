class TargetPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      user.trainer? ? scope.all : scope.none # Only trainers can see the Index of Workout Target Areas
    end
  end

  def create?
    user.trainer? # Only trainers can create a new target area in the form found on the Index of Workout Target Areas
  end

  def destroy?
    user.trainer? # Any trainer can delete any target area in the Index of Workout Target Areas
  end
end