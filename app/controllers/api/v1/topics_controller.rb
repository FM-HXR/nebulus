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
        topic = TopicsTag.new(topics_tag_params)
        if topic.save
          newTopic = Topic.find_by(title: topic.title, description: topic.description, views: 0, user_id: topic.user_id)
          render json: TopicSerializer.new(newTopic).serialized_json
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

      def update_views
        topic = Topic.find(params[:topic_id])
        if topic.update(view_update_params)
          render json: PointSerializer.new(topic).serialized_json
        else
          render json: {error: topic.errors.full_messages}, status: 422
        end
      end

      def add
        @topic = Topic.find(add_tag_params[:topic_id])
        if TopicsTag.add_tags(add_tag_params)
          render json: TopicSerializer.new(@topic, options).serialized_json
        else
          render json: {error: @topic.errors.full_messages}, status: 422
        end
      end

      def remove
        @topic = Topic.find(remove_tag_params[:topic_id])
        if TopicsTag.remove_tags(remove_tag_params)
          head :no_content
        else
          render json: {error: @topic.errors.full_messages}, status: 422
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
        # get request
        topics = Topic.text_search(params[:query])
        render json: TopicSerializer.new(topics, options).serialized_json
      end

      def random
        # get request
      end

      private

      def topic_params
        params.require(:topic).permit(:title, :description, :pro, :con, :category).merge(user_id: current_user.id)
      end

      def view_update_params
        params.require(:topic).permit(:views, :user_id)
      end

      def topics_tag_params
        params.require(:topics_tag).permit(:title, :description, :pro, :con, :category, :views, names: []).merge(user_id: current_user.id)
        # params.require(:topic_tag).permit(:title, :description, :pro, :con, :category, :views, :user_id, names: [])
      end

      def add_tag_params
        # params.require(:topic_tag).permit(names: [], :topic_id).merge(user_id: current_user.id)
        params.require(:topic_tag).permit(:topic_id, names: [])
      end

      def remove_tag_params
        parasm.require(:topic_tag).permit(:tag_id, :topic_id)
      end

      def options
        @options ||= { include: %i[points tags] }
      end 
    end
  end
end

