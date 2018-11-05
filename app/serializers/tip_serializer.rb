class TipSerializer < ActiveModel::Serializer
  attributes :id, :proper_form, :breathing_technique, :modification, :challenge
  belongs_to :movement
  belongs_to :user
end
