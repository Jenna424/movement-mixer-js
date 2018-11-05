class EquipmentRoutineSerializer < ActiveModel::Serializer
  attributes :id, :quantity, :weight
  belongs_to :equipment
  belongs_to :routine
end
