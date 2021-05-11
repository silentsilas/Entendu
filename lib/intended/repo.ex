defmodule Intended.Repo do
  use Ecto.Repo,
    otp_app: :intended,
    adapter: Ecto.Adapters.Postgres
end
