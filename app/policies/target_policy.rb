class TargetPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      user.trainer? ? scope.all : scope.none # Only trainers can see the Index of Workout Target Areas
    end
  end

  def new?
    user.trainer? # Only trainers can view the form to create a new target area
  end

  def create?
    new?
  end

  def destroy?
    user.trainer? # Any trainer can delete any target area in the Index of Workout Target Areas
  end
end