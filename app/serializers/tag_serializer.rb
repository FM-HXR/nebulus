class TagSerializer
  include FastJsonapi::ObjectSerializer
  attributes :name

  has_many :topic_tag_relations, dependent: :destroy
  has_many :topics, through: :topic_tag_relations
end
