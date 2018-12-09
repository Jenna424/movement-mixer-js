class RoutinePolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      if user.admin? # An admin views workout routines designed by ALL clients
        scope.all
      elsif user.trainer? # A trainer only views workout routines designed by HER OWN clients
        scope.where(user: user.clients)
      elsif user.client? # A client views an index of only HER OWN workout routines
        scope.where(user: user)
      else # unassigned users and viewers who are not logged in CANNOT view the Index of Workout Routines
        scope.none
      end
    end
  end

  def new?
    user.client?
  end

  def create?
    new?
  end
  
  def edit?
    routine_owner || routines_by_clients
  end

  def update?
    edit?
  end

  def destroy?
    routine_owner
  end

  private
    # The routine (record) belongs to the logged-in user
    def routine_owner
      record.user == user
    end
    # The logged-in user is a trainer, and the routine (record) belongs to a user who is that trainer's client
    def routines_by_clients
      if user.trainer?
        record.user.in?(user.clients)
      end
    end
end