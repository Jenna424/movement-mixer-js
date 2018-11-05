class Training < ApplicationRecord
  has_many :routine_trainings
  has_many :routines, through: :routine_trainings
end