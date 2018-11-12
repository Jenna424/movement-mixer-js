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
  # On the routine show page, if the current user designed the workout,
  # that user should be able to click the edit button / delete button next to each movement that comprises the workout
  # to edit just the attributes on the movement_routines join table (technique, sets and reps) /
  # or to delete the join model association between their workout routine and that exercise movement
  get '/routines/:routine_id/movements/:movement_id/edit' => 'movements#edit'
  patch '/routines/:routine_id/movements/:movement_id' => 'movements#update'
  delete '/routines/:routine_id/movements/:movement_id' => 'movements#destroy'
end