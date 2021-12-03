defmodule EntenduWeb.FallbackController do
  use EntenduWeb, :controller

  def call(conn, {:error, %Ecto.Changeset{} = changeset}) do
    conn
    |> put_status(:unprocessable_entity)
    |> put_view(EntenduWeb.ChangesetView)
    |> render("error.json", changeset: changeset)
  end
end
