class Routine < ApplicationRecord
  belongs_to :user
  has_many :equipment_routines, dependent: :destroy
  has_many :equipment, through: :equipment_routines
  has_many :movement_routines, dependent: :destroy
  has_many :movements, through: :movement_routines
  has_many :routine_targets, dependent: :destroy
  has_many :targets, through: :routine_targets
  has_many :routine_trainings, dependent: :destroy
  has_many :trainings, through: :routine_trainings

  accepts_nested_attributes_for :movement_routines, reject_if: :all_blank
  accepts_nested_attributes_for :equipment_routines, reject_if: :all_blank

  validates :title, presence: true, uniqueness: true
  validates :difficulty_level, inclusion: { in: ["Beginner", "Intermediate", "Advanced"] }
  validates :duration, numericality: { greater_than: 0 }
  validates :target_ids, presence: true
  validates :training_ids, presence: true

  delegate :name, to: :user, prefix: "designer" # I can call #designer_name on a routine instance to return the name of the client who created the routine
  
  def movements_attributes=(movements_attributes)
    movements_attributes.values.each do |movements_attribute|
      if !movements_attribute["name"].blank?
        movement = Movement.find_or_create_by(name: movements_attribute["name"])
        if mr = MovementRoutine.find_by(movement: movement, routine: self)
          mr.update(
           technique: movements_attribute["movement_routines"]["technique"],
           sets: movements_attribute["movement_routines"]["sets"],
           reps: movements_attribute["movement_routines"]["reps"]
          )
        else
          self.movement_routines.build(
            movement: movement,
            routine: self, 
            technique: movements_attribute["movement_routines"]["technique"],
            sets: movements_attribute["movement_routines"]["sets"],
            reps: movements_attribute["movement_routines"]["reps"]
          )
        end
      end
    end
  end

  def equipment_attributes=(equipment_attributes)
    equipment_attributes.values.each do |equipment_attribute|
      if !equipment_attribute["name"].blank?
        equipment = Equipment.find_or_create_by(name: equipment_attribute["name"])
        if er = EquipmentRoutine.find_by(equipment: equipment, routine: self)
          er.update(
            quantity: equipment_attribute["equipment_routines"]["quantity"],
            weight: equipment_attribute["equipment_routines"]["weight"]
          )
        else
          self.equipment_routines.build(
            equipment: equipment, 
            routine: self, 
            quantity: equipment_attribute["equipment_routines"]["quantity"], 
            weight: equipment_attribute["equipment_routines"]["weight"]
          )
        end
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

# Many-to-Many Relationship between routines and target areas
# A single workout routine can target several areas of the body,
# and workouts can be grouped by body focus. (e.g. all core workouts)

# Many-to-Many Relationship between routines and training types
# A single workout routine can combine several different training types (e.g. Cardio & HIIT)
# and workouts can be grouped by training type (e.g. all strength training workouts)