class UserPolicy < ApplicationPolicy
  def new?
  	true unless user
  end

  private

    def oneself # the user logged in is the selfsame user (record) whose profile is being viewed
      user == record
    end
end