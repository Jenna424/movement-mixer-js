admin = User.new(
  name: "Addison",
  email: "addison@mm.com",
  password: "adminaddison",
  password_confirmation: "adminaddison",
  role_requested: nil,
  role: 3,
  trainer_id: nil
)

admin.save(validate: false)

trainer = User.new(
  name: "Tracy",
  email: "tracy@mm.com",
  password: "trainertracy",
  password_confirmation: "trainertracy",
  role_requested: nil,
  role: 2,
  trainer_id: nil
)

trainer.save(validate: false)

targets = Target.create([
  { focus: 'Biceps' },
  { focus: 'Triceps' },
  { focus: 'Upper Arms' },
  { focus: 'Forearms' },
  { focus: 'Shoulders' },
  { focus: 'Back' },
  { focus: 'Chest' },
  { focus: 'Legs' },
  { focus: 'Quadriceps' },
  { focus: 'Hamstrings' },
  { focus: 'Thighs' },
  { focus: 'Glutes' },
  { focus: 'Calves' },
  { focus: 'Adductors' },
  { focus: 'Hips' },
  { focus: 'Abs' },
  { focus: 'Trapezius' }
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