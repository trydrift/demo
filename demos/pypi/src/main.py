"""Compare a submitted token against the expected one."""

from werkzeug.security import safe_str_cmp


def token_matches(submitted: str, expected: str) -> bool:
    """Return True when the two tokens are equal, without leaking timing."""
    return safe_str_cmp(submitted, expected)
