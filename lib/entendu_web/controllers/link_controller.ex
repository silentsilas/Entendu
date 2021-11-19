defmodule EntenduWeb.LinkController do
  @moduledoc """
  Controller responsible for managing links responses
  """

  use EntenduWeb, :controller

  def just(conn, _params) do
    render(conn, "just.html")
  end

  def for(conn, _params) do
    render(conn, "for.html")
  end

  def you(conn, _params) do
    render(conn, "you.html")
  end
end
