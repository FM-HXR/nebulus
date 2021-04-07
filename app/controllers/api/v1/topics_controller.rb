module Api
  module V1
    class TopicsController < ApplicationController
      protect_from_forgery with: :null_session

      def top
      end
      
      def index
        topics = Topic.includes(:user)
        render json: TopicSerializer.new(topics, options).serialized_json
      end

      def show
        topic = Topic.find(params[:id])
        render json: TopicSerializer.new(topic, options).serialized_json
      end

      def create
        topic = Topic.new(topic_params)
        if topic.save
          render json: TopicSerializer.new(topic).serialized_json
        else
          # 422 = Unprocessable entity
          render json: {error: topic.errors.full_messages}, status: 422
        end
      end

      def update
        topic = Topic.find(params[:id])
        if topic.update(topic_params)
          render json: TopicSerializer.new(topic, options).serialized_json
        else
          render json: {error: topic.errors.full_messages}, status: 422
        end
      end 
      
      def destroy
        topic = Topic.find(params[:id])
        if topic.destroy
          head :no_content
        else
          render json: {error: topic.errors.full_messages}, status: 422
        end
      end

      def search
      end

      def random
      end

      private
      def topic_params
        params.require(:topic).permit(:title, :description, :pro, :con, :user_id)
      end

      def options
        @options ||= { include: %i[points] }
      end 
    end
  end
end

