class MovementRoutineSerializer < ActiveModel::Serializer
  attributes :id, :technique, :sets, :reps, :movement_id, :routine_id, :updated_at
  belongs_to :movement
  belongs_to :routine
end
