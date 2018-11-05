class TargetSerializer < ActiveModel::Serializer
  attributes :id, :focus
  has_many :routines
end