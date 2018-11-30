class GuidePolicy < ApplicationPolicy
  def create? # only trainers (users whose role = 2) can create training guides
    user.trainer?
  end

  def edit? # Only the trainer who created the training guide can edit it
    guide_owner
  end

  def permitted_attributes # user_id cannot be changed
    if guide_owner
      [:proper_form, :breathing_technique, :modification, :challenge]
    end
  end

  def update?
    edit?
  end

  def destroy?
    edit?
  end

  private

    def guide_owner
      user == record.user # The logged-in user is the same user who created the training guide (record)
    end
end
