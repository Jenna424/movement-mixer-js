class RoutineSerializer < ActiveModel::Serializer
  attributes :id, :title, :difficulty_level, :duration
  belongs_to :user
  has_many :movement_routines # serialized because join table contains user-submittable attributes (reps, sets, technique)
  has_many :movements
  has_many :equipment_routines # serialized because join table contains user-submittable attributes (weight, quantity)
  has_many :equipment
  has_many :targets
  has_many :trainings
end