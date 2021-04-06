class Comment < ApplicationRecord
  belongs_to :point
  belongs_to :user
end
