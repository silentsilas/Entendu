defmodule Entendu.Links.Link do
  use Ecto.Schema
  import Ecto.Changeset

  schema "links" do
    field :burn_after_reading, :boolean, default: false
    field :expires, :utc_datetime

    timestamps()
  end

  @doc false
  def changeset(link, attrs) do
    link
    |> cast(attrs, [:expires, :burn_after_reading])
    |> validate_required([:expires, :burn_after_reading])
  end
end
