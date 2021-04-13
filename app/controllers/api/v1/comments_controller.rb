module Api
  module V1
    class CommentsController < ApplicationController
      protect_from_forgery with: :null_session
      before_action :get_point, only: [:create]
      
      def create
        comment = @point.comments.new(comment_params)
        binding.pry
        if comment.save
          render json: CommentSerializer.new(comment).serialized_json
        else
          render json: {error: comment.errors.full_messages}, status: 422
        end
      end

      def update
        comment = Comment.find(params[:id])
        if comment.update(comment_params)
          render json: CommentSerializer.new(comment).serialized_json
        else
          render json: {error: comment.errors.full_messages}, status: 422
        end
      end
      
      def destroy
        comment = Comment.find(params[:id])
        if comment.destroy
          head :no_content
        else
          render json: {error: comment.errors.full_messages}, status: 422
        end
      end

      private
      def get_point
        @point = Point.find(params[:point_id])
      end

      def comment_params
        params.require(:comment).permit(:text, :point_id).merge(user_id: current_user.id)
      end
    end
  end
end