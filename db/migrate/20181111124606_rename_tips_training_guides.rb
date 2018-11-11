class RenameTipsTrainingGuides < ActiveRecord::Migration[5.2]
  def change
  	rename_table :tips, :training_guides
  end
end
