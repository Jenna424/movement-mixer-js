class EquipmentRoutine < ApplicationRecord
  belongs_to :equipment
  belongs_to :routine
  validates :quantity, numericality: { greater_than: 0 }
  validates :weight, numericality: { greater_than: 0 }, allow_nil: true
end
