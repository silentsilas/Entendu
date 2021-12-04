defmodule Entendu.Links.Link do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, Ecto.UUID, autogenerate: true}

  schema "links" do
    field :burn_after_reading, :boolean, default: false
    field :expires, :utc_datetime
    field :filename, :string
    field :filetype, :string
    field :text_content, :string
    field :file_content, :string
    field :recipient, :string
    field :service, :string

    timestamps()
  end

  @doc false
  def changeset(link, attrs) do
    link
    |> cast(attrs, [
      :expires,
      :burn_after_reading,
      :filename,
      :filetype,
      :text_content,
      :file_content,
      :recipient,
      :service
    ])
  end
end
