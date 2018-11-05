class User < ApplicationRecord
  
  enum role: { unassigned: 0, client: 1, trainer: 2, admin: 3 }

  has_many :clients, class_name: "User", foreign_key: "trainer_id"
  belongs_to :trainer, class_name: "User", optional: true

  has_many :routines
  has_many :tips

  has_secure_password
end