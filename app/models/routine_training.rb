class RoutineTraining < ApplicationRecord
  belongs_to :routine # routine_id in routine_trainings join table
  belongs_to :training # training_id in routine_trainings join table
end
