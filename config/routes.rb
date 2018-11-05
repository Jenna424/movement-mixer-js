Rails.application.routes.draw do
  resources :routines do
    resources :results
  end
end