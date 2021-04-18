class CreatePoints < ActiveRecord::Migration[6.1]
  def change
    create_table :points do |t|
      t.string :title, null: false
      t.boolean :position, null: false
      t.boolean :markdown, null: false
      t.text :argument, null: false
      t.integer :bright, null: false, default: 0
      t.integer :dim, null: false, default: 0
      t.integer :dark, null: false, default: 0
      t.belongs_to :topic, null: false, foreign_key: true
      t.belongs_to :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
