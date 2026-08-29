"""Session and credential helpers.

This module is written against Werkzeug 2.0. The Codespace upgraded the
dependency to Werkzeug 2.1 without touching this code, so every marked usage
below is now broken.
"""

# ── BREAKING 1 ────────────────────────────────────────────────────────────
# `safe_str_cmp` was removed in Werkzeug 2.1. It was deprecated in 2.0 in
# favour of `hmac.compare_digest`. This import raises ImportError outright.
from werkzeug.security import safe_str_cmp

# ── BREAKING 2 ────────────────────────────────────────────────────────────
# `pbkdf2_hex` and `pbkdf2_bin` were removed in Werkzeug 2.1; hashlib has
# `pbkdf2_hmac` built in.
from werkzeug.security import pbkdf2_hex

# ── BREAKING 3 ────────────────────────────────────────────────────────────
# `werkzeug.urls.Href` was removed in 2.1, along with much of the old URL
# helper surface.
from werkzeug.urls import Href

# ── BREAKING 4 ────────────────────────────────────────────────────────────
# The whole `werkzeug.useragents` module was removed in 2.1; `Request.user_agent`
# now returns a much smaller object.
from werkzeug.useragents import UserAgent


def token_matches(submitted: str, expected: str) -> bool:
    """Compare two tokens without leaking timing information."""
    return safe_str_cmp(submitted, expected)


def hash_password(password: str, salt: str) -> str:
    """Derive a storable hash for a password."""
    return pbkdf2_hex(password, salt, iterations=150_000)


def api_url(base: str) -> Href:
    """Build a URL helper rooted at ``base``."""
    return Href(base)


def browser_family(header: str) -> str:
    """Return the browser name from a User-Agent header."""
    return UserAgent(header).browser or "unknown"
