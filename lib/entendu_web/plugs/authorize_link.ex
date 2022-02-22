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

  defp get_link_id(%{params: %{"id" => link_id}}), do: link_id

  defp get_link_id(%{params: %{"path" => [_, link_id, _]}}), do: link_id

  def call(conn, _params) do
    link_id = get_link_id(conn)
    user = get_session(conn, :current_user)

    if !user do
      conn
      |> put_status(403)
      |> put_view(EntenduWeb.ErrorView)
      |> render("error_code.json", message: "Unauthorized", code: 403)
      |> halt
    else
      with %Link{recipient: recipient} = link <- Links.get_link(link_id),
           true <- UserFromAuth.can_access?(recipient, user) do
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
end
