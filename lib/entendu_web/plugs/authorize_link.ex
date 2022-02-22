defmodule EntenduWeb.Plugs.AuthorizeLink do
  import Plug.Conn
  use EntenduWeb, :controller

  alias Entendu.Repo
  alias Entendu.UserFromAuth
  alias Entendu.Links
  alias Entendu.Links.Link
  alias EntenduWeb.FallbackController
  alias EntenduWeb.ErrorView

  def init(_params) do
  end

  def call(conn, params) do
    %{params: %{"path" => [_, link_id, _]}} = conn
    user = get_session(conn, :current_user)

    if !user do
      conn
      |> put_status(403)
      |> put_view(EntenduWeb.ErrorView)
      |> render("error_code.json", message: "Unauthorized", code: 403)
      |> halt
    else
      with {:ok, user} <- get_user_from_path(conn),
           %Link{recipient: recipient} = link <- Links.get_link(link_id),
           true <- UserFromAuth.can_access?(recipient, user.emails) do
        conn
        |> assign(:link, link)
      else
        nil ->
          conn
          |> put_status(404)
          |> put_view(EntenduWeb.ErrorView)
          |> render("error_code.json", message: "Link could not be found", code: 404)
          |> halt

        false ->
          conn
          |> put_status(403)
          |> put_view(EntenduWeb.ErrorView)
          |> render("error_code.json", message: "Unauthorized", code: 403)
          |> halt

        {:error, reason} ->
          conn
          |> put_status(422)
          |> put_view(EntenduWeb.ErrorView)
          |> render("error_code.json", message: reason, code: 422)
          |> halt
      end
    end
  end

  defp get_user_from_path(%{params: %{"path" => [_, link_id, _]}} = conn) do
    get_session(conn, :current_user)
    |> get_user_from_path()
  end

  defp get_user_from_path(nil) do
    {:error, "User not authenticated"}
  end

  defp get_user_from_path(%{id: _, name: _, emails: _} = user) do
    {:ok, user}
  end

  defp get_user_from_path(_), do: {:error, "Link does not exist"}
end
