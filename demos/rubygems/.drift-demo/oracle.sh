#!/usr/bin/env bash
# Native oracle for the Ruby fixture.
#
# Against the committed baseline (rack 3.0.0) loading lib/static_app.rb and
# calling file_server succeeds. Against the upgraded tree (3.1.0) it must fail:
# Rack 3.1 removed the deprecated `Rack::File` alias, so the constant lookup
# raises NameError.
set -euo pipefail
bundle install --quiet --path .drift-demo/.bundle
bundle exec ruby -Ilib -e 'require "static_app"; StaticApp.file_server("."); puts "oracle: Rack::File OK"'
