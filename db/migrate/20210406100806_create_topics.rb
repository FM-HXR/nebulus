class CreateTopics < ActiveRecord::Migration[6.1]
  def change
    create_table :topics do |t|
      t.string :title, null: false
      # t.string :category, null: false
      t.text :description, null: false
      t.string :pro, null: false
      t.string :con, null: false
      t.integer :category, null: false, default: 0
      t.integer :views, null: false, default: 0
      t.belongs_to :user, null: false, foreign_key: true
      t.timestamps
    end
  end
end
