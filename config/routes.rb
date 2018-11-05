Rails.application.routes.draw do
  get 'users/new'
  get 'users/edit'
  root 'welcome#home'
  get '/signup' => 'users#new'
  get '/login' => 'sessions#new'
  post '/login' => 'sessions#create'
  delete '/logout' => 'sessions#destroy'
  resources :users, except: [:new]
  resources :routines do
  	resources :results
  end
end