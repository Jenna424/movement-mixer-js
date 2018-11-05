class TrainingSerializer < ActiveModel::Serializer
  attributes :id, :fitness_type
  has_many :routines
end