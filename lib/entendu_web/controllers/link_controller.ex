defmodule EntenduWeb.LinkController do
  @moduledoc """
  Controller responsible for managing links responses
  """

  use EntenduWeb, :controller
  use Params

  alias Entendu.Links
  alias Links.Link
  alias EntenduWeb.FallbackController

  action_fallback(FallbackController)

  def just_page(conn, _params) do
    render(conn, "just.html")
  end

  def just(conn, params) do
    with {:ok, %Link{} = link} <- Links.create_link(params) do
      conn
      |> render("show_authorized.json", %{link: link})
         else
          test ->
            IO.inspect(test)
    end
  end

  def for_page(conn, _params) do
    render(conn, "for.html")
  end

  def for(conn, %{"link_id" => link_id, "recipient" => recipient, "service" => service}) do
    with %Link{} = link <- Links.get_link(link_id),
         Links.update_link(link, %{ recipient: recipient, service: service}) do
      conn
      |> render("show_authorized.json", %{link: link})
    end
  end

  def you_page(conn, _params) do
    render(conn, "you.html")
  end

  def auth_page(conn, %{ "id" => link_id}) do
    with %Link{service: service, recipient: recipient} = link <- Links.get_link(link_id) do
      conn
      |> put_session(:current_link, link)
      |> render("auth.html", %{ service: service, recipient: recipient })
    end
  end
end
