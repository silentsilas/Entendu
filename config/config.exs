# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :intended,
  ecto_repos: [Intended.Repo]

# Configures the endpoint
config :intended, IntendedWeb.Endpoint,
  url: [host: "dev.intended.link"],
  secret_key_base: "zD+9wmcpxZakT6/UWCF624ncmjzKNAd0wMqfzD4OpnSqypCB824uTR3WJxSpimhp",
  render_errors: [view: IntendedWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: Intended.PubSub,
  live_view: [signing_salt: "bkId594F"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Configures Ueberauth
config :ueberauth, Ueberauth,
  providers: [
    auth0: { Ueberauth.Strategy.Auth0, [] },
  ]

# Configures Ueberauth's Auth0 auth provider
config :ueberauth, Ueberauth.Strategy.Auth0.OAuth,
  domain: System.get_env("AUTH0_DOMAIN"),
  client_id: System.get_env("AUTH0_CLIENT_ID"),
  client_secret: System.get_env("AUTH0_CLIENT_SECRET")

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
