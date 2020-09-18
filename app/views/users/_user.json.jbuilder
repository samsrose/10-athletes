json.extract! user, :id, :email, :username, :firstname, :lastname :sports, :events
json.url users_url(user, format: :json)
