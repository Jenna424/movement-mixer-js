class Movement < ApplicationRecord
  has_many :guides, dependent: :destroy
  has_many :movement_routines, dependent: :destroy
  has_many :routines, through: :movement_routines

  def next
    movement = Movement.where("id > ?", id).first
    movement ? movement : Movement.first
  end

  def previous
    movement = Movement.where("id < ?", id).last
    movement ? movement : Movement.first
  end

end