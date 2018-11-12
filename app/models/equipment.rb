class Equipment < ApplicationRecord
  has_many :equipment_routines, dependent: :destroy
  has_many :routines, through: :equipment_routines
end
