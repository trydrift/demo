defmodule DriftDemo.Router do
  @moduledoc "Starts the HTTP listener for this application."

  @doc "Child spec for the web server, for use in a supervision tree."
  def child_spec(port) do
    # Plug 1.13 still ships the Plug.Adapters.Cowboy2 shim.
    Plug.Adapters.Cowboy2.child_spec(scheme: :http, plug: __MODULE__, options: [port: port])
  end
end
