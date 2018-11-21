class Target < ApplicationRecord
  has_many :routine_targets, dependent: :destroy
  has_many :routines, through: :routine_targets
  validates :focus, uniqueness: true
  validates :focus, presence: true
end
