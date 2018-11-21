class Training < ApplicationRecord
  has_many :routine_trainings, dependent: :destroy
  has_many :routines, through: :routine_trainings
  validates :fitness_type, presence: true, uniqueness: true
end