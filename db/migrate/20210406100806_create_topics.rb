class CreateTopics < ActiveRecord::Migration[6.1]
  def change
    create_table :topics do |t|
      t.string :title, null: false
      # t.string :category, null: false
      t.string :pro_con, array: true, null: false
      t.belongs_to :user, null: false, foreign_key: true
      t.timestamps
    end
  end
end
