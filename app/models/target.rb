class Target < ApplicationRecord
  has_many :routine_targets, dependent: :destroy
  has_many :routines, through: :routine_targets
  validates :focus, presence: true, uniqueness: true
end
