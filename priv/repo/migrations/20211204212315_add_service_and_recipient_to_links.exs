defmodule Entendu.Repo.Migrations.AddServiceAndRecipientToLinks do
  use Ecto.Migration

  def change do
    alter table(:links) do
      add :recipient, :string
      add :service, :string
    end
  end
end
