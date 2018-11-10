class UserPolicy < ApplicationPolicy
  def new
  	true unless user
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

  private

  	def oneself # the user logged in is the selfsame user (record) whose profile is being viewed
  	  user == record
  	end
end