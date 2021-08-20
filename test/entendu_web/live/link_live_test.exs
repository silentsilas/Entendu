defmodule EntenduWeb.LinkLiveTest do
  use EntenduWeb.ConnCase

  import Phoenix.LiveViewTest

  alias Entendu.Links

  @create_attrs %{burn_after_reading: true, expires: "2010-04-17T14:00:00Z"}
  @update_attrs %{burn_after_reading: false, expires: "2011-05-18T15:01:01Z"}
  @invalid_attrs %{burn_after_reading: nil, expires: nil}

  defp fixture(:link) do
    {:ok, link} = Links.create_link(@create_attrs)
    link
  end

  defp create_link(_) do
    link = fixture(:link)
    %{link: link}
  end

  describe "Index" do
    setup [:create_link]

    test "lists all links", %{conn: conn, link: link} do
      {:ok, _index_live, html} = live(conn, Routes.link_index_path(conn, :index))

      assert html =~ "Listing Links"
    end

    test "saves new link", %{conn: conn} do
      {:ok, index_live, _html} = live(conn, Routes.link_index_path(conn, :index))

      assert index_live |> element("a", "New Link") |> render_click() =~
               "New Link"

      assert_patch(index_live, Routes.link_index_path(conn, :new))

      assert index_live
             |> form("#link-form", link: @invalid_attrs)
             |> render_change() =~ "can&#39;t be blank"

      {:ok, _, html} =
        index_live
        |> form("#link-form", link: @create_attrs)
        |> render_submit()
        |> follow_redirect(conn, Routes.link_index_path(conn, :index))

      assert html =~ "Link created successfully"
    end

    test "updates link in listing", %{conn: conn, link: link} do
      {:ok, index_live, _html} = live(conn, Routes.link_index_path(conn, :index))

      assert index_live |> element("#link-#{link.id} a", "Edit") |> render_click() =~
               "Edit Link"

      assert_patch(index_live, Routes.link_index_path(conn, :edit, link))

      assert index_live
             |> form("#link-form", link: @invalid_attrs)
             |> render_change() =~ "can&#39;t be blank"

      {:ok, _, html} =
        index_live
        |> form("#link-form", link: @update_attrs)
        |> render_submit()
        |> follow_redirect(conn, Routes.link_index_path(conn, :index))

      assert html =~ "Link updated successfully"
    end

    test "deletes link in listing", %{conn: conn, link: link} do
      {:ok, index_live, _html} = live(conn, Routes.link_index_path(conn, :index))

      assert index_live |> element("#link-#{link.id} a", "Delete") |> render_click()
      refute has_element?(index_live, "#link-#{link.id}")
    end
  end

  describe "Show" do
    setup [:create_link]

    test "displays link", %{conn: conn, link: link} do
      {:ok, _show_live, html} = live(conn, Routes.link_show_path(conn, :show, link))

      assert html =~ "Show Link"
    end

    test "updates link within modal", %{conn: conn, link: link} do
      {:ok, show_live, _html} = live(conn, Routes.link_show_path(conn, :show, link))

      assert show_live |> element("a", "Edit") |> render_click() =~
               "Edit Link"

      assert_patch(show_live, Routes.link_show_path(conn, :edit, link))

      assert show_live
             |> form("#link-form", link: @invalid_attrs)
             |> render_change() =~ "can&#39;t be blank"

      {:ok, _, html} =
        show_live
        |> form("#link-form", link: @update_attrs)
        |> render_submit()
        |> follow_redirect(conn, Routes.link_show_path(conn, :show, link))

      assert html =~ "Link updated successfully"
    end
  end
end
