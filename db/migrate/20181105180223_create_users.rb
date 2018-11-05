class CreateUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :users do |t|
      t.string :name
      t.string :email
      t.string :password_digest
      t.string :uid
      t.string :provider
      t.integer :trainer_id
      t.string :role_requested

      t.timestamps
    end
  end
end
