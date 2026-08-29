#!/usr/bin/env bash
# Native oracle for the .NET fixture.
#
# Against the committed baseline (AutoMapper 8.1.1) `dotnet build` succeeds.
# Against the upgraded tree (9.0.0) it must fail: AutoMapper 9 removed
# the static Mapper.Initialize entry point, which Program.cs calls, so the
# compiler reports CS0117.
set -euo pipefail
dotnet build --nologo -v quiet
echo "oracle: dotnet build OK"
