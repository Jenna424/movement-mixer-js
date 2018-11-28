class MovementSerializer < ActiveModel::Serializer
  attributes :id, :name
  has_many :guides
  has_many :movement_routines
  has_many :routines
end