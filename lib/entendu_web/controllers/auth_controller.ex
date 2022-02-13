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
    # TODO: turn this into plug that only proceeds if current_link session var exists
    %{ id: link_id, recipient: recipient } = get_session(conn, :current_link)

    with {:ok, user} <- UserFromAuth.find_or_create(auth),
      true <- UserFromAuth.can_access?(recipient, user.emails) do
        # TODO: send over encrypted data that the frontend can decrypt
        conn
        |> put_session(:current_user, user)
        |> configure_session(renew: true)
        |> redirect(to: "/just/for/you/#{link_id}")

    else
      false ->
        conn
        |> put_flash(:error, "#{recipient} was not found in your list of verified emails")
        |> redirect(to: "/just/for/you/#{link_id}")

      {:error, reason} ->
        conn
        |> put_flash(:error, reason)
        |> redirect(to: "/just/for/you/#{link_id}")
    end
  end
end
