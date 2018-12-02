# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

targets = Target.create([
  { focus: 'Biceps' }, 
  { focus: 'Triceps' },
  { focus: 'Upper Arms' },
  { focus: 'Lower Arms' },
  { focus: 'Shoulders' },
  { focus: 'Back' },
  { focus: 'Pectorals' },
  { focus: 'Lower Legs' },
  { focus: 'Quadriceps' },
  { focus: 'Hamstrings' },
  { focus: 'Upper Legs' },
  { focus: 'Thighs' },
  { focus: 'Glutes' },
  { focus: 'Calf Muscles' },
  { focus: 'Adductors' },
  { focus: 'Hips' }
])

trainings = Training.create([
  { fitness_type: 'Cardio' },
  { fitness_type: 'Pilates' },
  { fitness_type: 'Barre' },
  { fitness_type: 'Yoga' },
  { fitness_type: 'Strength' },
  { fitness_type: 'Endurance' },
  { fitness_type: 'HIIT' },
  { fitness_type: 'Aerobic' },
  { fitness_type: 'Weight Lifting' }
])