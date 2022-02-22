defmodule EntenduWeb.Router do
  use EntenduWeb, :router

  alias EntenduWeb.Plugs.AuthorizeLink

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, {EntenduWeb.LayoutView, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :authorized_files do
    plug AuthorizeLink
    plug Plug.Static, at: "/uploads", from: Path.expand('./uploads'), gzip: false
  end

  pipeline :authorized_link do
    plug AuthorizeLink
  end

  scope "/", EntenduWeb do
    pipe_through :browser

    get "/", PageController, :index
    get "/just", LinkController, :just_page
    post "/just", LinkController, :just
    get "/just/for", LinkController, :for_page
    post "/just/for", LinkController, :for
    get "/just/for/you", LinkController, :you_page
    get "/just/for/you/:id", LinkController, :auth_page
  end

  scope "/auth", EntenduWeb do
    pipe_through :browser

    get "/:provider", AuthController, :request
    get "/:provider/callback", AuthController, :callback
    delete "/logout", AuthController, :delete
  end

  scope "/uploads", EntenduWeb do
    pipe_through [:browser, :authorized_files]
    get "/*path", FileNotFoundController, :index
  end

  scope "/links", EntenduWeb do
    pipe_through [:browser, :authorized_link]
    get "/:id", LinkController, :authorized_link
  end

  # Other scopes may use custom stacks.
  # scope "/api", EntenduWeb do
  #   pipe_through :api
  # end

  # Enables LiveDashboard only for development
  #
  # If you want to use the LiveDashboard in production, you should put
  # it behind authentication and allow only admins to access it.
  # If your application does not have an admins-only section yet,
  # you can use Plug.BasicAuth to set up some basic authentication
  # as long as you are also using SSL (which you should anyway).
  if Mix.env() in [:dev, :test] do
    import Phoenix.LiveDashboard.Router

    scope "/" do
      pipe_through :browser
      live_dashboard "/dashboard", metrics: EntenduWeb.Telemetry
    end
  end
end
