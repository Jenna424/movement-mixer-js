class CreateMovementRoutines < ActiveRecord::Migration[5.2]
  def change
    create_table :movement_routines do |t|
      t.integer :movement_id
      t.integer :routine_id
      t.text :technique
      t.integer :sets
      t.integer :reps

      t.timestamps
    end
  end
end
