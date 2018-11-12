class Guide < ApplicationRecord
  belongs_to :movement
  belongs_to :user
  validates :proper_form, presence: true
  validates :breathing_technique, presence: true
  validates :modification, presence: true
  validates :challenge, presence: true

  def self.by_trainer(trainer)
    where(user: trainer)
  end
end