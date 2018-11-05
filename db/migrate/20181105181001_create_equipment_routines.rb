class CreateEquipmentRoutines < ActiveRecord::Migration[5.2]
  def change
    create_table :equipment_routines do |t|
      t.integer :equipment_id
      t.integer :routine_id
      t.integer :weight
      t.integer :quantity

      t.timestamps
    end
  end
end
