class CreateTips < ActiveRecord::Migration[5.2]
  def change
    create_table :tips do |t|
      t.integer :movement_id
      t.integer :user_id
      t.text :proper_form
      t.text :breathing_technique
      t.text :modification
      t.text :challenge

      t.timestamps
    end
  end
end
