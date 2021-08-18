defmodule Entendu.Repo do
  use Ecto.Repo,
    otp_app: :entendu,
    adapter: Ecto.Adapters.Postgres
end
