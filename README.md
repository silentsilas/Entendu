# Entendu

To start your Phoenix server:

  * (optional) Install ['ASDF'](https://asdf-vm.com/) along with the ['Erlang'](https://github.com/asdf-vm/asdf-erlang), ['Elixir'](https://github.com/asdf-vm/asdf-elixir), and ['Node'](https://github.com/asdf-vm/asdf-nodejs) plugins
  * (optional) Run `asdf install`. Now this project will always use the correct erlang/elixir/node/npm versions.
  * Install dependencies with `mix deps.get`
  * Create and migrate your database with `mix ecto.setup`
  * Install Node.js dependencies with `npm install` inside the `assets` directory
  * Run `mix phx.gen.cert` to use HTTPS during development, required for OAuth
  * Start Phoenix endpoint with `mix phx.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

Ready to run in production? Please [check our deployment guides](https://hexdocs.pm/phoenix/deployment.html).

## Setting up OAuth

Add the OAuth providers you'll be using to the providers array.

```
use Mix.Config
config :ueberauth, Ueberauth,
  providers: [
    github: {Ueberauth.Strategy.Github, []}
  ]
```

You'll need to visit each provider's site and set up OAuth. This usually entails creating an OAuth App to generate a client_id, and generating a client_secret. Then create a `dev.secret.exs` file in your config folder and add your client_id & secret to your provider's ueberauth config.

```
config :ueberauth, Ueberauth.Strategy.Github.OAuth,
  client_id: "some_client_id",
  client_secret: "some_secret_key"
```
