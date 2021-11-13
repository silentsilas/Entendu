defmodule EntenduWeb.LinkController do
  @moduledoc """
  Controller responsible for managing links responses
  """

  use EntenduWeb, :controller

  def just(conn, _params) do
      render(conn, "just.html")
  end
end
