#!/usr/bin/env bash
# Native oracle for the Python fixture.
#
# Against the committed baseline (Werkzeug 2.0.3) importing src/main.py
# succeeds. Against the upgraded tree (2.1.0) it must fail: Werkzeug 2.1
# removed `werkzeug.security.safe_str_cmp`, so the import raises ImportError.
#
# This is what proves the fixture is a real break rather than a plausible one.
set -euo pipefail
python3 -m venv .drift-demo/.venv
.drift-demo/.venv/bin/pip install -q -r requirements.txt
.drift-demo/.venv/bin/python -c "import src.main; print('oracle: safe_str_cmp import OK')"
