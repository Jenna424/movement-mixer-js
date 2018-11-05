class Routine < ApplicationRecord
  belongs_to :user
  has_many :results
  has_many :equipment_routines
  has_many :equipment, through: :equipment_routines
  has_many :movement_routines
  has_many :movements, through: :movement_routines
  has_many :routine_targets
  has_many :targets, through: :routine_targets
  has_many :routine_trainings
  has_many :trainings, through: :routine_trainings

  def movements_attributes=(movements_attributes)
    movements_attributes.values.each do |movements_attribute|
      if !movements_attribute["name"].blank?
        movement = Movement.find_or_create_by(name: movements_attribute["name"])
        self.movement_routines.build(routine: self, movement: movement, technique: movements_attribute["movement_routines"]["technique"], sets: movements_attribute["movement_routines"]["sets"],
        reps: movements_attribute["movement_routines"]["reps"])
      end
    end
  end

  def equipment_attributes=(equipment_attributes)
    equipment_attributes.values.each do |equipment_attribute|
      if !equipment_attribute["name"].blank?
        equipment = Equipment.find_or_create_by(name: equipment_attribute["name"])
        self.equipment_routines.build(routine: self, equipment: equipment, quantity: equipment_attribute["equipment_routines"]["quantity"], weight: equipment_attribute["equipment_routines"]["weight"])
      end
    end
  end
end

# Many-to-Many Relationship between routines and movements:
# Many exercise movements comprise a single workout routine,
# and a single exercise movement can be performed in several different workouts.

# Many-to-Many Relationship between routines and equipment
# Many pieces of equipment can be used in a single workout routine,
# and an individual piece of equipment is utilized in several different workouts.
