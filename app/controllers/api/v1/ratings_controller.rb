module Api
  module V1
    class RatingsController < ApplicationController
      protect_from_forgery with: :null_session
      before_action :get_point, only: [:create]

      def create
        rating = @point.ratings.new(rating_params)
        if rating.save
          render json: RatingSerializer.new(rating).serialized_json
        else
          render json: {error: comment.errors.full_messages}, status: 422
        end
      end

      def update
        rating = Rating.find(params[:id])
        if rating.update(rating_params)
          render json: RatingSerializer.new(rating).serialized_json
        else
          render json: {error: comment.errors.full_messages}, status: 422
        end
      end

      def destroy
        rating = Rating.find(params[:id])
        if rating.destroy
          head :no_content
        else
          render json: {error: comment.errors.full_messages}, status: 422
        end
      end

      private
      def get_point
        @point = Point.find(params[:point_id])
      end

      def rating_params
        # params.require(:rating).permit(:rate, :point_id, :user_id)
        params.require(:rating).permit(:rate_name, :point_id).merge(user_id: current_user.id)
      end
    end
  end
end