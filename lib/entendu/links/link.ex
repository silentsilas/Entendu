defmodule Entendu.Links.Link do
  use Ecto.Schema
  import Ecto.Changeset

  schema "links" do
    field :burn_after_reading, :boolean, default: false
    field :expires, :utc_datetime
    field :filename, :string
    field :filetype, :string
    field :text_content, :string
    field :file_content, :string

    timestamps()
  end

  @doc false
  def changeset(link, attrs) do
    link
    |> cast(attrs, [:expires, :burn_after_reading, :filename, :filetype, :text_content, :file_content])
    |> validate_required([:expires, :burn_after_reading, :filename, :filetype])
  end
end
