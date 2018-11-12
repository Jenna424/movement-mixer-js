class MovementSerializer < ActiveModel::Serializer
  attributes :id, :name
  has_many :movement_routines
  has_many :routines
  has_many :guides
end
