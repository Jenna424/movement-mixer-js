Rails.application.routes.draw do
  root 'welcome#welcome'
  get '/signup' => 'users#new'
  get '/login' => 'sessions#new'
  post '/login' => 'sessions#create'
  delete '/logout' => 'sessions#destroy'
  get '/access' => 'users#access'
  get '/movements/:id/next' => 'movements#next'
  get '/movements/:id/previous' => 'movements#previous'
  
  resources :users, except: [:new]
  resources :routines do
  	resources :results
  end
  resources :movements, only: [:index, :show] do
    resources :guides
  end
  # Custom Routes:
  # On the routine show page, if the current user designed the workout routine,
  # that user should be able to click the Edit Exercise Link that is found next to each exercise movement in the workout
  # to edit the user-submittable attributes on the movement_routines join table (technique, sets and reps)
  get '/mrs/:id' => 'routines#show_technique'
  get '/routines/:routine_id/movements/:movement_id/edit' => 'routines#edit_movement_routine'
  patch '/routines/:routine_id/movements/:movement_id' => 'routines#update_movement_routine'
  delete '/routines/:routine_id/movements/:movement_id' => 'routines#destroy_movement_routine'
end