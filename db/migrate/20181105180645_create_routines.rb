class CreateRoutines < ActiveRecord::Migration[5.2]
  def change
    create_table :routines do |t|
      t.string :title
      t.string :difficulty_level
      t.integer :duration
      t.integer :user_id

      t.timestamps
    end
  end
end
