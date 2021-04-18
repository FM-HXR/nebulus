class RatingSerializer
  include FastJsonapi::ObjectSerializer
  attributes :rate_name, :user_id, :point_id

  belongs_to :user
  belongs_to :point
end
