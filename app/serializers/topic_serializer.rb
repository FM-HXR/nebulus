class TopicSerializer
  include FastJsonapi::ObjectSerializer
  attributes :title, :description, :pro, :con, :category, :views, :created_at, :updated_at, :user

  belongs_to :user
  has_many :points
  # has_many :topic_tag_relations, dependent: :destroy
  has_many :tags, through: :topic_tag_relations
end
