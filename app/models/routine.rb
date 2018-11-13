class Routine < ApplicationRecord
  belongs_to :user
  has_many :results
  has_many :equipment_routines, dependent: :destroy
  has_many :equipment, through: :equipment_routines
  has_many :movement_routines, dependent: :destroy
  has_many :movements, through: :movement_routines
  has_many :routine_targets, dependent: :destroy
  has_many :targets, through: :routine_targets
  has_many :routine_trainings, dependent: :destroy
  has_many :trainings, through: :routine_trainings

  accepts_nested_attributes_for :movement_routines, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :equipment_routines, reject_if: :all_blank, allow_destroy: true

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

  def targets_attributes=(targets_attributes)
    targets_attributes.values.each do |targets_attribute|
      if !targets_attribute["focus"].blank?
        target_area = Target.find_or_create_by(focus: targets_attribute["focus"])
        self.routine_targets.build(routine: self, target: target_area)
      end
    end
  end

  def trainings_attributes=(trainings_attributes)
    trainings_attributes.values.each do |trainings_attribute|
      if !trainings_attribute["fitness_type"].blank?
        training_type = Training.find_or_create_by(fitness_type: trainings_attribute["fitness_type"])
        self.routine_trainings.build(routine: self, training: training_type)
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