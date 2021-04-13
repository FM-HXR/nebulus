class CommentSerializer
  include FastJsonapi::ObjectSerializer
  attributes :text, :point, :user, :created_at, :updated_at

  belongs_to :point
  belongs_to :user
end
