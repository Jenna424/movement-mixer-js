class CreateRoutineTrainings < ActiveRecord::Migration[5.2]
  def change
    create_table :routine_trainings do |t|
      t.integer :routine_id
      t.integer :training_id

      t.timestamps
    end
  end
end
