defmodule EntenduWeb.ErrorViewTest do
  use EntenduWeb.ConnCase, async: true

  # Bring render/3 and render_to_string/3 for testing custom views
  import Phoenix.View

  test "renders 404.html" do
    assert render_to_string(EntenduWeb.ErrorView, "404.html", []) == "Not Found"
  end

  test "just endpoint creates a link with valid attrs", %{conn: conn} do
    params = %{
      "text_content" => "some gibberish",
      "filename" => "more gibberish"
    }

    conn = post(conn, Routes.link_path(conn, :just), params)

    response = json_response(conn, 201)

    assert %{
             "id" => _link_id,
             "text_content" => "some gibberish",
             "filename" => "more gibberish"
           } = response
  end
end
