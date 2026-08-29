defmodule DriftDemo.Server do
  @moduledoc """
  HTTP entry point.

  This module is written against Plug 1.13. The Codespace upgraded the
  dependency to Plug 1.15 without touching this code.
  """

  # ── BREAKING ────────────────────────────────────────────────────────────
  # Plug.Adapters.Cowboy2 was removed in Plug 1.15. It had been a deprecated
  # shim for the separate :plug_cowboy package since Plug 1.7, and
  # lib/plug/adapters/cowboy2.ex is simply gone from the 1.15 release, so this
  # call raises UndefinedFunctionError.
  def child_spec(port) do
    Plug.Adapters.Cowboy2.child_spec(scheme: :http, plug: __MODULE__, options: [port: port])
  end
end
