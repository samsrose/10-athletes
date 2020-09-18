Rails.application.routes.draw do
  post '/login', to: 'sessions#create'
  delete '/logout', to: 'sessions#destroy'
  get '/logged_in', to: 'sessions#is_logged_in?'

  resources :users, defaults: {format: JSON}, only: [:create, :index, :update]
  resources :sports, only: [:create, :show, :index, :update]
  resources :events, only: [:create, :show, :index]

end
