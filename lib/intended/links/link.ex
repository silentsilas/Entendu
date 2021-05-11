defmodule Intended.Links.Link do
  use Ecto.Schema
  import Ecto.Changeset

  schema "links" do
    field :expires, :naive_datetime

    timestamps()
  end

  @doc false
  def changeset(link, attrs) do
    link
    |> cast(attrs, [:expires])
    |> validate_required([:expires])
  end
end
