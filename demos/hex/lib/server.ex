defmodule DriftDemo.Server do
  @moduledoc """
  HTTP entry point.

  This module is written against Plug 1.13. The Codespace upgraded the
  dependency to Plug 1.15 without touching this code, so every marked call
  below refers to something that no longer exists.
  """

  # ── BREAKING 1 ──────────────────────────────────────────────────────────
  # Plug.Adapters.Cowboy2 was removed in Plug 1.15. It had been a deprecated
  # shim for the separate :plug_cowboy package since Plug 1.7.
  def child_spec(port) do
    Plug.Adapters.Cowboy2.child_spec(scheme: :http, plug: __MODULE__, options: [port: port])
  end

  # ── BREAKING 2 ──────────────────────────────────────────────────────────
  # Plug.Adapters.Test.Conn was removed in the same sweep; the test helper is
  # Plug.Test now.
  def test_conn(method, path) do
    Plug.Adapters.Test.Conn.conn(%Plug.Conn{}, method, path, nil)
  end

  # ── BREAKING 3 ──────────────────────────────────────────────────────────
  # Plug.Parsers.JSON was removed — JSON parsing goes through
  # Plug.Parsers with a :json_decoder option.
  def parser_opts do
    [parsers: [Plug.Parsers.JSON], pass: ["application/json"]]
  end
end
