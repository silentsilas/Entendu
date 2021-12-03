defmodule EntenduWeb.LinkController do
  @moduledoc """
  Controller responsible for managing links responses
  """

  use EntenduWeb, :controller
  use Params

  alias Entendu.Links
  alias Links.Link
  alias Ecto.Changeset
  alias EntenduWeb.FallbackController

  action_fallback(FallbackController)

  def just_page(conn, _params) do
    render(conn, "just.html")
  end

  defparams(
    first_step(%{
      burn_after_reading: [field: :boolean, default: false],
      expires: :utc_datetime,
      filename: :string,
      filetype: :string,
      text_content: :string,
      file_content: :string
    })
  )

  def just(conn, params) do
    with %Changeset{valid?: true} = changeset <- first_step(params),
         link_params <- Params.to_map(changeset),
         {:ok, %Link{} = link} <- Links.create_link(link_params) do
      conn
      |> put_status(:created)
      |> assign(:link, link)
      |> render("show_authorized.json", %{link: link})
    end
  end

  def for_page(conn, _params) do
    render(conn, "for.html")
  end

  def for(_conn, %{username: _username, service: _service}) do
    {:error, "not implemented"}
  end

  def you_page(conn, _params) do
    render(conn, "you.html")
  end
end
