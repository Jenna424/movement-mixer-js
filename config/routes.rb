Rails.application.routes.draw do
	root 'welcome#home'
	resources :routines do
		resources :results
	end
end