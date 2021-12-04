defmodule EntenduWeb.LinkView do
  use EntenduWeb, :view

  def render("show_authorized.json", %{link: link}) do
    %{
      id: link.id,
      burn_after_reading: link.burn_after_reading,
      expires: link.expires,
      filename: link.filename,
      filetype: link.filetype,
      text_content: link.text_content,
      file_content: link.file_content
    }
  end

  def render("show_unauthorized.json", %{link: link}) do
    %{
      id: link.id
    }
  end
end
