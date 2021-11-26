defmodule EntenduWeb.LinkController do
  @moduledoc """
  Controller responsible for managing links responses
  """

  use EntenduWeb, :controller

  def just_page(conn, _params) do
    render(conn, "just.html")
  end

  def just(conn, %{encrypted_contents: contents}) do
    conn
    |> put_session(:encrypted_contents, contents)
    |> redirect(to: "/just/for")
  end

  def for_page(conn, _params) do
    render(conn, "for.html")
  end

  def for(conn, %{username: username, service: service}) do
    {:error, "not implemented"}
  end

  def you_page(conn, _params) do
    render(conn, "you.html")
  end
end
