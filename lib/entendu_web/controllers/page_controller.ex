defmodule EntenduWeb.PageController do
  @moduledoc """
  Static page controller
  """

  use EntenduWeb, :controller

  def index(conn, _params) do
    conn
    |> clear_session()
    |> render("index.html")
  end
end
