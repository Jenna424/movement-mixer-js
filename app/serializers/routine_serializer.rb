class RoutineSerializer < ActiveModel::Serializer
  attributes :id, :title, :difficulty_level, :duration
  belongs_to :user
  has_many :movement_routines # serialized because join table contains user-submittable attributes
  has_many :movements
  has_many :equipment_routines # serialized because join table contains user-submittable attributes
  has_many :equipment
  has_many :targets
  has_many :trainings
end