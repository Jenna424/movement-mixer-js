Rails.application.routes.draw do
  root 'welcome#home'
  get '/accounts' => 'users#accounts'
  # Routes for Signing Up / Logging In / Logging Out:
  get '/signup' => 'users#new'
  get '/login' => 'sessions#new'
  post '/login' => 'sessions#create'
  delete '/logout' => 'sessions#destroy'
  # Custom Routes that Map to Actions in MovementsController:
  get '/movements/:id/next' => 'movements#next'
  get '/movements/:id/previous' => 'movements#previous'
  get '/mrs/:id' => 'movements#show_technique'
  # --- Editing, Updating & Deleting User-Submittable Attributes Stored in movement_routines Join Table:
  get '/mrs/:id/edit' => 'routines#edit_movement_routine'
  patch '/mrs/:id' => 'routines#update_movement_routine'
  delete '/mrs/:id' => 'routines#destroy_movement_routine'
  # --- Editing, Updating & Deleting User-Submittable Attributes Stored in equipment_routines Join Table ---
  get '/ers/:id/edit' => 'routines#edit_equipment_routine'
  patch '/ers/:id' => 'routines#update_equipment_routine'
  delete '/ers/:id' => 'routines#destroy_equipment_routine'
  # RESTful Routes:
  resources :users, except: [:new]
  resources :routines
  resources :movements, only: [:index, :show] do
    resources :guides
  end
  resources :targets, only: [:new, :create, :index, :destroy]
  resources :trainings, only: [:new, :create, :index, :destroy]
end