require 'rack'

# This file is written against Rack 3.0.
# The Codespace upgraded the dependency to Rack 3.1 without touching this code.
# Rack 3.1 deleted a group of constants that 3.0 still carried as deprecated
# aliases, so every marked reference below now raises NameError.
module App
  # ── BREAKING 1 ──────────────────────────────────────────────────────────
  # Rack::File was removed in Rack 3.1. It had been a deprecated alias of
  # Rack::Files since 2.1.
  def self.file_server(root)
    Rack::File.new(root)
  end

  # ── BREAKING 2 ──────────────────────────────────────────────────────────
  # Rack::Chunked was removed in Rack 3.1 — chunked encoding is handled by the
  # server, not by middleware, under the Rack 3 spec.
  def self.chunked(app)
    Rack::Chunked.new(app)
  end

  # ── BREAKING 3 ──────────────────────────────────────────────────────────
  # Rack::Auth::Digest was removed in Rack 3.1; digest auth was dropped
  # entirely rather than being replaced.
  def self.digest_auth(app, realm)
    Rack::Auth::Digest::MD5.new(app, realm) { |_user| 'secret' }
  end

  def self.build(root)
    chunked(file_server(root))
  end
end
