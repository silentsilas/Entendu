defmodule Entendu.Repo.Migrations.AddFilenameToLinks do
  use Ecto.Migration

  def change do
    alter table(:links) do
      remove_if_exists(:content, :string)
      add :filename, :string
      add :filetype, :string
      add :text_content, :string
      add :file_content, :string
    end
  end
end
