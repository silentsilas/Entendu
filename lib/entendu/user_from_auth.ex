defmodule Entendu.UserFromAuth do
  @moduledoc """
  Retrieve the user information from an auth request
  """
  require Logger
  require Jason

  alias Ueberauth.Auth
  alias Entendu.Links.Link

  def find_or_create(%Auth{} = auth) do
    {:ok, basic_info(auth)}
  end

  # github does it this way
  defp avatar_from_auth(%{info: %{urls: %{avatar_url: image}}}), do: image

  # facebook does it this way
  defp avatar_from_auth(%{info: %{image: image}}), do: image

  # default case if nothing matches
  defp avatar_from_auth(auth) do
    Logger.warn("#{auth.provider} needs to find an avatar URL!")
    Logger.debug(Jason.encode!(auth))
    nil
  end

  # github
  defp emails_from_auth(%Auth{extra: %Auth.Extra{raw_info: %{user: %{"emails" => emails}}}}),
    do: emails

  defp emails_from_auth(%Auth{info: %{email: email}}), do: [email]

  defp emails_from_auth(_auth), do: []

  defp username_from_auth(%Auth{info: %{nickname: username}}), do: username

  defp username_from_auth(auth) do
    Logger.warn("#{auth.provider} needs to be configured for accessing their username!")
    IO.inspect(auth, label: "username_from_auth")
    nil
  end

  defp basic_info(auth) do
    %{
      id: auth.uid,
      name: name_from_auth(auth),
      avatar: avatar_from_auth(auth),
      emails: emails_from_auth(auth),
      username: username_from_auth(auth)
    }
  end

  defp name_from_auth(auth) do
    if auth.info.name do
      auth.info.name
    else
      name =
        [auth.info.first_name, auth.info.last_name]
        |> Enum.filter(&(&1 != nil and &1 != ""))

      if Enum.empty?(name) do
        auth.info.nickname
      else
        Enum.join(name, " ")
      end
    end
  end

  def can_access?(recipient, %{emails: emails, username: username}),
    do: email_matches?(recipient, emails) || username_matches?(recipient, username)

  defp email_matches?(recipient, emails),
    do: emails |> Enum.any?(&(&1["verified"] == true and &1["email"] == recipient))

  defp username_matches?(recipient, username), do: String.trim(username) === recipient
end
