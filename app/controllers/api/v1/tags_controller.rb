module Api
  module V1
    class TagsController < ApplicationController
      protect_from_forgery with: :null_session

      def index
        tags = Tag.all.order(:name)
        render json: TagSerializer.new(tags).serialized_json
      end
      
    end
  end
end