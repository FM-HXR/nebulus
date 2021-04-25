class TopicsTag
  include ActiveModel::Model

  attr_accessor :title, :description, :pro, :con, :category, :views, :user_id, :names, :tag_id

  # Save New Topic, Tags and Associations between Topic and Tags in New Form
  def save
    topic = Topic.create(title: title, description: description, pro: pro, con: con, category: category, views: views, user_id: user_id)
    names.each do |name|
      tag = Tag.where(name: name).first_or_initialize
      tag.save
      TopicTagRelation.create(tag_id: tag.id, topic_id: topic.id)
    end
  end

  # params => :topic_id names:[] user_id: current_user.id
  def self.add_tags(params)
    topic = Topic.find(params[:topic_id])
    names = params[:names]
    names.each do |name|
      tag = Tag.where(name: name).first_or_initialize
      tag.save
      TopicTagRelation.create(tag_id: tag.id, topic_id: topic.id)
    end
  end

  # Delete Relation Between target Topic and its Tags onClick in Edit Form
  def self.remove_tags(params)
    tag_id = params[:tag_id]
    topic_id= params[:topic_id]
    relation = TopicTagRelation.where(tag_id: tag_id, topic_id: topic_id)
    relation.destroy_all
  end
end 