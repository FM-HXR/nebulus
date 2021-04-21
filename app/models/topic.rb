class Topic < ApplicationRecord
  belongs_to :user

  has_many :points, dependent: :destroy

  def self.text_search(query)
    if query.present?
      where("title @@ :q or description @@ :q", q: query)
    else
      includes(:user).order_by("created_at DESC")
    end
  end
end
