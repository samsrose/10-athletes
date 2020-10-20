if Rails.env === 'production'
  Rails.application.config.session_store :cookie_store, key: '_10-athletes', domain: 'https://tenathletes.herokuapp.com'
else
  Rails.application.config.session_store :cookie_store, key: '_10-athletes'
end
