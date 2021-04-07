Rails.application.routes.draw do
  devise_for :users
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  root "pages#index"

  namespace :api do
    namespace :v1 do
     resources :topics do
        collection do 
          get :top
          get :search
          get :random
        end
     end
     resources :points, only: [:create, :update, :destroy, :show]
     resources :comments, only: [:create, :update, :destroy]
    end
  end

  get '*path', to: 'pages#index', via: :all
end
