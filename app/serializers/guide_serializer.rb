class GuideSerializer < ActiveModel::Serializer
  attributes :id, :proper_form, :breathing_technique, :modification, :challenge
  belongs_to :user
  belongs_to :movement
end
