class ChangeSports < ActiveRecord::Migration[6.0]
  def change
    remove_column :sports, :email
    add_column :sports, :alternate_name, :string
  end
end
