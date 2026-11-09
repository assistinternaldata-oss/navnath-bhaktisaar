"""Serve the app locally:  python tools/serve.py  [port]   ->  http://localhost:5180

Sets correct content types explicitly (Windows can map .js to text/plain, which breaks the app).
"""
import functools
import http.server
import sys
from pathlib import Path

APP = Path(__file__).resolve().parent.parent
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 5180


class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".js": "text/javascript",
        ".mjs": "text/javascript",
        ".css": "text/css",
        ".json": "application/json",
        ".webmanifest": "application/manifest+json",
        ".svg": "image/svg+xml",
        ".png": "image/png",
        ".mp3": "audio/mpeg",
        ".m4a": "audio/mp4",
        ".html": "text/html; charset=utf-8",
    }

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()


if __name__ == "__main__":
    handler = functools.partial(Handler, directory=str(APP))
    with http.server.ThreadingHTTPServer(("127.0.0.1", PORT), handler) as httpd:
        print(f"Serving {APP} at http://localhost:{PORT}")
        httpd.serve_forever()
