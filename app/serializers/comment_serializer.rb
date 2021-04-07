class CommentSerializer
  include FastJsonapi::ObjectSerializer
  attributes :text, :point, :user

  belongs_to :point
  belongs_to :user
end
