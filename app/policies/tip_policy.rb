class TipPolicy < ApplicationPolicy
  def create? # only trainers (users whose role = 2) can create training tip guides
    user.trainer?
  end

  def edit? # Only the trainer who created the training tip guide can edit it
    tip_owner
  end

  def permitted_attributes # user_id cannot be changed
    if tip_owner
      [:proper_form, :breathing_technique, :modification, :challenge]
    end
  end

  def update?
    edit?
  end

  def destroy? # Only the trainer who created the training tip guide can delete the training tip guide
    tip_owner
  end

  private

    def tip_owner
      user == record.user # The logged-in user is the same user who created the training tip guide (record)
    end
end
