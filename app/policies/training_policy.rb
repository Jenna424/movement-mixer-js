class TrainingPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      user.trainer? ? scope.all : scope.none # Only trainers can see the Index of Fitness Training Types
    end
  end

  def new? # Only trainers can view the form to create a new training type
    user.trainer?
  end

  def create?
    new?
  end

  def destroy? # Any trainer can delete any training type
    user.trainer?
  end
end