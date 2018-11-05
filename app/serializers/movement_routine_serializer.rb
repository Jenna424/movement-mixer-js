class MovementRoutineSerializer < ActiveModel::Serializer
  attributes :id, :technique, :sets, :reps, :movement_id, :routine_id
  belongs_to :movement
  belongs_to :routine
end
