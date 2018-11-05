class Equipment < ApplicationRecord
  has_many :equipment_routines
  has_many :routines, through: :equipment_routines
end
