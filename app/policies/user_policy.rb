class UserPolicy < ApplicationPolicy
  def new?
    true unless user
  end

  def create?
    new?
  end

  def show?
    if user.admin? # An admin can see every user show page
      true
    elsif user.trainer? # A trainer can see her own show page and her own clients' show pages
      oneself || record.trainer == user
    elsif user.client? # A client can see her own show page
      oneself
    end
  end

  def edit?
    oneself
  end

  def permitted_attributes
    if oneself && record.unassigned?
      [:name, :email, :password, :password_confirmation, :role_requested]
    elsif oneself
      [:name, :email, :password, :password_confirmation]
    elsif user.admin?
      [:role, :trainer_id]
    end
  end

  def update?
    oneself || user.admin?
  end

  def destroy? # Only admins and the user who owns her account can delete her account
    if user.unassigned? || user.client? || user.trainer?
      oneself
    elsif user.admin?
      true unless oneself # An admin cannot delete her own account
    end
  end

  private

    def oneself # the user logged in is the selfsame user (record) whose profile is being viewed
      user == record
    end
end
