class PointSerializer
  include FastJsonapi::ObjectSerializer
  attributes :title, :position, :point, :topic, :user

  belongs_to :user
  belongs_to :topic
  # has_many :comments
  # has_many_attached :images
end