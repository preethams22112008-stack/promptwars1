import http.server
import socketserver
import os
import sys

PORT = int(os.environ.get("PORT", 8080))
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class FairShiftHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        if self.path in ("/", "/index.html"):
            self.path = "/preview.html"
        return super().do_GET()

def main():
    socketserver.TCPServer.allow_reuse_address = True
    print(f"FairShift serving live at http://0.0.0.0:{PORT} (Local: http://localhost:{PORT})")
    sys.stdout.flush()
    with socketserver.TCPServer(("", PORT), FairShiftHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer terminated.")

if __name__ == "__main__":
    main()
