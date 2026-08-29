require 'rack'

# Serve files from a directory using Rack's static file middleware.
module StaticApp
  # Rack 3.0 still exposes Rack::File as an alias of Rack::Files.
  def self.file_server(root)
    Rack::File.new(root)
  end
end
