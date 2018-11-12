class User < ApplicationRecord
  
  enum role: { unassigned: 0, client: 1, trainer: 2, admin: 3 }

  has_many :clients, class_name: "User", foreign_key: "trainer_id"
  belongs_to :trainer, class_name: "User", optional: true
  
  has_many :routines, dependent: :destroy
  has_many :guides, dependent: :destroy

  has_secure_password

  def self.by_role(string_role)
    where(role: string_role)
  end

  def self.awaiting_assignment(rejected_roles, role_number)
    by_role("unassigned").where.not(role_requested: rejected_roles, role: role_number)
  end

end