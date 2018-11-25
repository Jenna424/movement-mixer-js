class EquipmentRoutine < ApplicationRecord
  belongs_to :equipment
  belongs_to :routine
  validates :quantity, presence: true, numericality: { greater_than: 0 }
end
