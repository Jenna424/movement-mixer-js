class Movement < ApplicationRecord
  has_many :tips # A trainer can provide a training tip on how to execute the exercise movement
  has_many :movement_routines
  has_many :routines, through: :movement_routines
end