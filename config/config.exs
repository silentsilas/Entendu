# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :entendu,
  ecto_repos: [Entendu.Repo]

config :entendu, Entendu.Repo, migration_primary_key: [type: :uuid]

# Configures the endpoint
config :entendu, EntenduWeb.Endpoint,
  url: [host: "dev.intended.link"],
  secret_key_base: "6PqoqDqHzsXs6pcm/QoI48rR0paD0gxubXBaR6j/b1fJNgL6Fawn5JPl82N/M2NR",
  render_errors: [view: EntenduWeb.ErrorView, accepts: ~w(html json), layout: false],
  pubsub_server: Entendu.PubSub,
  live_view: [signing_salt: "tPbX7ix7"]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

config :ueberauth, Ueberauth,
  providers: [
    github: {Ueberauth.Strategy.Github, [default_scope: "user:email", allow_private_emails: true]}
  ]

config :waffle,
  storage: Waffle.Storage.Local

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
