Rails.application.routes.draw do
  devise_for :users
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  root "pages#index"

  namespace :api do
    namespace :v1 do
     resources :topics do
        patch "/update_views/" => "topics#update_views" 
        collection do 
          post :add
          delete :remove
          get :top
          get :search
          get :random
        end
     end
     resources :points, only: [:create, :update, :destroy, :show] do
        patch "/update_views/" => "points#update_views"
     end 
     resources :comments, only: [:create, :update, :destroy]
     resources :ratings, only: [:create, :update, :destroy]
     resources :tags, only: [:index]
    end
  end

  get '*path', to: 'pages#index', via: :all
end
