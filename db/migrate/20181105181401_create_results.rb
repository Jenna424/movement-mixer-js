class CreateResults < ActiveRecord::Migration[5.2]
  def change
    create_table :results do |t|
      t.string :observations
      t.integer :routine_id

      t.timestamps
    end
  end
end
