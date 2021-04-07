class TopicSerializer
  include FastJsonapi::ObjectSerializer
  attributes :title, :description, :pro, :con, :user

  belongs_to :user
  has_many :points
end
