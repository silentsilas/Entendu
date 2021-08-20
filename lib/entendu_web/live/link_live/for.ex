defmodule EntenduWeb.LinkLive.For do
  use EntenduWeb, :live_view

  @impl true
  def mount(_params, _session, socket) do
    {:ok, socket |> assign(:step, 1)}
  end

  def handle_event("next_step", _, %{ assigns: %{ step: step } } = socket) do
    socket = socket |> assign(:step, step + 1)
    {:noreply, socket}
  end
end
