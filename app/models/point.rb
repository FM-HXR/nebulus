class Point < ApplicationRecord
  belongs_to :topic
  belongs_to :user

  has_many :comments, dependent: :destroy
end
