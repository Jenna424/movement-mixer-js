class MovementRoutine < ApplicationRecord
  belongs_to :movement
  belongs_to :routine
  validates :technique, presence: true
  validates :sets, presence: true, numericality: { greater_than: 0 }
  validates :reps, presence: true, numericality: { greater_than: 0 }
end
