defmodule Intended.Repo.Migrations.CreateLinks do
  use Ecto.Migration

  def change do
    create table(:links) do
      add :expires, :naive_datetime

      timestamps()
    end

  end
end
