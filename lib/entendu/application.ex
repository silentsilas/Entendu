defmodule Entendu.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    # topologies = [
    #   chat: [
    #     strategy: Cluster.Strategy.Gossip
    #   ]
    # ]

    topologies = [
      k8s_entendu: [
        strategy: Elixir.Cluster.Strategy.Kubernetes.DNS,
          config: [
            service: "entendu-nodes",
            application_name: "entendu"
          ]
        ]
      ]

    children = case Application.get_env(:frayt_elixir, :enable_k8s) do
      true -> [
        {Cluster.Supervisor, [topologies, [name: Entendu.ClusterSupervisor]]}
      ]
      _ -> []
    end
    |> Kernel.++([
      # Start the Ecto repository
      Entendu.Repo,
      # Start the Telemetry supervisor
      EntenduWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: Entendu.PubSub},
      # Start the Endpoint (http/https)
      EntenduWeb.Endpoint
      # Start a worker by calling: Entendu.Worker.start_link(arg)
      # {Entendu.Worker, arg}
    ])

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Entendu.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    EntenduWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
