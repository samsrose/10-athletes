class Sport < ApplicationRecord
  validates :name, uniqueness: true
  validates :name, presence: true
  # has_many :events
end
