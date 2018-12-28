admin = User.new(
  name: "Addison",
  email: "addison@mm.com",
  password: "adminaddison",
  password_confirmation: "adminaddison",
  role_requested: nil,
  role: 3,
  trainer_id: nil
)

admin.save(valid: false)

trainer = User.new(
  name: "Tracy",
  email: "tracy@mm.com",
  password: "trainertracy",
  password_confirmation: "trainertracy",
  role_requested: nil,
  role: 2,
  trainer_id: nil
)

trainer.save(valid: false)

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
  { fitness_type: 'Weight Lifting' },
  { fitness_type: 'Flexibility Training' },
  { fitness_type: 'Dynamic Strength Training' },
  { fitness_type: 'Static Strength Training' },
  { fitness_type: 'Circuit Training' },
  { fitness_type: 'Tabata' },
  { fitness_type: 'Zumba' },
  { fitness_type: 'Cycling' }
])