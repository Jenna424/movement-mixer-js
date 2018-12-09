class MovementRoutine < ApplicationRecord
  belongs_to :movement
  belongs_to :routine
  validates :technique, presence: true
  validates :sets, numericality: { greater_than: 0 }
  validates :reps, numericality: { greater_than: 0 }
end
