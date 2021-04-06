class Topic < ApplicationRecord
  belongs_to :user

  has_many :points, dependent: :destroy
end
