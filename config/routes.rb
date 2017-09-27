Rails.application.routes.draw do
  resources :contact, only: [:index, :create]


  root "home#index"

  get "/:slug" => "home#index", slug: /.*/
end
