class EquipmentSerializer < ActiveModel::Serializer
  attributes :id, :name
  has_many :equipment_routines
  has_many :routines
end
