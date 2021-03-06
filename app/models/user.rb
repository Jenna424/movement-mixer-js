class User < ApplicationRecord
  enum role: { unassigned: 0, client: 1, trainer: 2, admin: 3 }

  has_many :clients, class_name: "User", foreign_key: "trainer_id"
  belongs_to :trainer, class_name: "User", optional: true
  
  has_many :routines, dependent: :destroy
  has_many :guides, dependent: :destroy

  has_secure_password

  validates :name, presence: true
  validates :password, length: { minimum: 8 }, allow_nil: true # when users edit their information, they don't have to retype their passwords
  validates :email, presence: true, email: true, uniqueness: true, length: { maximum: 100 }
  validates :role_requested, inclusion: { in: ["client", "trainer"], message: "must be selected from the available roles" }, on: :create

  def self.by_role(string_role)
    where(role: string_role)
  end

  def self.awaiting_assignment(rejected_roles, requested_role_number)
    by_role("unassigned").where.not(role_requested: rejected_roles, role: requested_role_number)
  end
end