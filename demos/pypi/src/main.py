"""Build a query string from a mapping, using Werkzeug's URL helpers."""

from werkzeug.urls import url_encode


def to_query_string(params: dict) -> str:
    """Encode a mapping of parameters as an application/x-www-form-urlencoded string."""
    return url_encode(params)
