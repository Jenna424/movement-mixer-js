class TrainingPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      if user.trainer? # Only trainers can see the index of all training types (which contains delete buttons)
        scope.all
      else
        scope.none
      end
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