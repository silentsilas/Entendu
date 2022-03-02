defmodule EntenduWeb.AuthController do
  @moduledoc """
  Auth controller responsible for handling Ueberauth responses
  """

  use EntenduWeb, :controller

  plug Ueberauth

  alias Entendu.UserFromAuth

  def delete(conn, _params) do
    conn
    |> put_flash(:info, "You have been logged out!")
    |> clear_session()
    |> redirect(to: "/")
  end

  def callback(%{assigns: %{ueberauth_failure: _fails}} = conn, _params) do
    conn
    |> put_flash(:error, "Failed to authenticate.")
    |> redirect(to: "/")
  end

  def callback(%{assigns: %{ueberauth_auth: auth}} = conn, _params) do
    link = get_session(conn, :intended_link)

    with %{id: link_id} <- link,
         {:ok, user} <- UserFromAuth.find_or_create(auth) do
      conn
      |> put_session(:current_user, user)
      |> configure_session(renew: true)
      |> redirect(to: "/just/for/you/#{link_id}")
    else
      nil ->
        conn
        |> put_flash(:error, "Could not find link to authenticate against")
        |> redirect(to: "/just/for/you/")

      {:error, reason} ->
        conn
        |> put_flash(:error, reason)
        |> redirect(to: "/just/for/you/#{link.id}")
    end
  end
end
