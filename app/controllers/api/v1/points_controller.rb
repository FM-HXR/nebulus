module Api
  module V1
    class PointsController < ApplicationController
      protect_from_forgery with: :null_session
      before_action :get_topic, only: [:create]

      def show
        point = Point.find(params[:id])
        render json: PointSerializer.new(point, options)
      end

      def create
        point = @topic.points.new(point_params)
        if point.save
          render json: PointSerializer.new(point).serialized_json
        else
          render json: {error: point.errors.full_messages}, status: 422
        end
      end

      def update
        point = Point.find(params[:id])
        if point.update(point_params)
          render json: PointSerializer.new(point, options).serialized_json
        else
          render json: {error: point.errors.full_messages}, status: 422
        end
      end

      def destroy
        point = Point.find(params[:id])
        if point.destroy
          head :no_content
        else
          render json: {error: point.errors.full_messages}, status: 422
        end
      end
      
      private

      def get_topic
        @topic = Topic.find(params[:topic_id])
      end
    
      def point_params
        params.require(:point).permit(:title, :position, :markdown, :argument, :bright, :dim, :dark, :views, :topic_id).merge(user_id: current_user.id)
      end

      # Called as a method so not @options but options.
      def options
        # @options ||= { include: %i[comments] }
        @options ||= { include: %i[comments ratings] }
      end 
    end
  end
end