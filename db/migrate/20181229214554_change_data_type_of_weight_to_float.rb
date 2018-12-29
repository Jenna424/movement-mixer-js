class ChangeDataTypeOfWeightToFloat < ActiveRecord::Migration[5.2]
  def change
  	change_column :equipment_routines, :weight, :float
  end
end
