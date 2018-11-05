class Routine < ApplicationRecord
  belongs_to :user
  has_many :results
  has_many :equipment_routines
  has_many :equipment, through: :equipment_routines
  has_many :movement_routines
  has_many :movements, through: :movement_routines
  has_many :routine_targets
  has_many :targets, through: :routine_targets
  has_many :routine_trainings
  has_many :trainings, through: :routine_trainings
end
