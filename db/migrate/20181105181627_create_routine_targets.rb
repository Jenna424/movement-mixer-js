class CreateRoutineTargets < ActiveRecord::Migration[5.2]
  def change
    create_table :routine_targets do |t|
      t.integer :routine_id
      t.integer :target_id

      t.timestamps
    end
  end
end
