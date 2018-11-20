class EquipmentRoutineSerializer < ActiveModel::Serializer
  attributes :id, :quantity, :weight, :updated_at
  belongs_to :equipment
  belongs_to :routine
end
