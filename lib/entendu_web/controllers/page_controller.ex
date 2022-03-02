defmodule EntenduWeb.PageController do
  @moduledoc """
  Static page controller
  """

  use EntenduWeb, :controller

  def index(conn, _params) do
    conn
    |> render("index.html")
  end

  def privacy(conn, _params) do
    conn
    |> render("privacy_policy.html")
  end
end
