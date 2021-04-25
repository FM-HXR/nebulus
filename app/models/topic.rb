class Topic < ApplicationRecord
  belongs_to :user
  has_many :points, dependent: :destroy
  has_many :topic_tag_relations, dependent: :destroy
  has_many :tags, through: :topic_tag_relations  

  include PgSearch
  pg_search_scope :search, against: [:title, :description],
    using: {tsearch: {dictionary: "english"}},
    associated_against: {user: :username, points: :title}

  def self.text_search(query)
    if query.present?
      search(query)
      # where("title @@ :q or description @@ :q", q: query)
    else
      includes(:user).order("created_at DESC")
    end
  end
end
