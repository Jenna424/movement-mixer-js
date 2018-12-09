class RoutinePolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      if user.client? || user.admin? # Clients and admins view an index of ALL clients' workout routines
        scope.all
      elsif user.trainer? # A trainer views an index of workout routines designed by HER OWN clients
        scope.where(user: user.clients)
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