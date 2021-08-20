defmodule Entendu.Repo.Migrations.CreateLinks do
  use Ecto.Migration

  def change do
    create table(:links, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :expires, :utc_datetime
      add :burn_after_reading, :boolean, default: false, null: false
      add :content, :text

      timestamps()
    end

  end
end
