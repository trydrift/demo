#!/usr/bin/env bash
# Native oracle for the Maven fixture.
#
# Against the committed baseline `mvn compile` succeeds. Against the upgraded
# tree it must fail: Guava 21 removed Objects.firstNonNull, which Config.java
# calls, so javac reports "cannot find symbol".
set -euo pipefail
mvn -B -q compile
echo "oracle: mvn compile OK"
