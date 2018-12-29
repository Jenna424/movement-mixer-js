class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :role
  has_many :routines
  has_many :guides
end
