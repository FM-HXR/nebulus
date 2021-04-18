class CreateRatings < ActiveRecord::Migration[6.1]
  def change
    create_table :ratings do |t|
      t.string :rate_name, null: false
      t.belongs_to :user, null: false, foreign_key: true
      t.belongs_to :point, null: false, foreign_key: true

      t.timestamps
    end
  end
end
