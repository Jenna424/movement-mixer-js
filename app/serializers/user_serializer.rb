class UserSerializer < ActiveModel::Serializer
  attributes :id, :name, :email
  has_many :routines
  has_many :guides
end
