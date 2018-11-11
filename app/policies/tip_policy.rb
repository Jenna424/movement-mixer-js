class TipPolicy < ApplicationPolicy
  def create? # only trainers (users whose role = 2) can create training tip guides
    user.trainer?
  end

  def edit? # Only the trainer who created the training tip guide can edit it
    tip_owner
  end

  private

    def tip_owner
      user == record.user # The logged-in user is the same user who created the training tip guide (record)
    end
end
