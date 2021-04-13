class TopicSerializer
  include FastJsonapi::ObjectSerializer
  attributes :title, :description, :pro, :con, :created_at, :updated_at, :user

  belongs_to :user
  has_many :points
end
