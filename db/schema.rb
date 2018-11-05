# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2018_11_05_181703) do

  create_table "equipment", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "equipment_routines", force: :cascade do |t|
    t.integer "equipment_id"
    t.integer "routine_id"
    t.integer "weight"
    t.integer "quantity"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "movement_routines", force: :cascade do |t|
    t.integer "movement_id"
    t.integer "routine_id"
    t.text "technique"
    t.integer "sets"
    t.integer "reps"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "movements", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "results", force: :cascade do |t|
    t.string "observations"
    t.integer "routine_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "routine_targets", force: :cascade do |t|
    t.integer "routine_id"
    t.integer "target_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "routine_trainings", force: :cascade do |t|
    t.integer "routine_id"
    t.integer "training_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "routines", force: :cascade do |t|
    t.string "title"
    t.string "difficulty_level"
    t.integer "duration"
    t.integer "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.string "password_digest"
    t.string "uid"
    t.string "provider"
    t.integer "trainer_id"
    t.string "role_requested"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "role", default: 0
  end

end
