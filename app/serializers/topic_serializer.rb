class TopicSerializer
  include FastJsonapi::ObjectSerializer
  attributes :title, :description, :pro_con, :user

  belongs_to :user
  has_many :points
end
