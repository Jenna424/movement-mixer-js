class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :role
  has_many :routines
  has_many :guides
end
