class CreateTrainings < ActiveRecord::Migration[5.2]
  def change
    create_table :trainings do |t|
      t.string :fitness_type
      t.string :string

      t.timestamps
    end
  end
end
