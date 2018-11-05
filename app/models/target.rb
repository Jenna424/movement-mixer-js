class Target < ApplicationRecord
  has_many :routine_targets
  has_many :routines, through: :routine_targets
  validates :focus, uniqueness: true
end
