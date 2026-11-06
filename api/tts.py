import urllib.request
import urllib.parse
from http.server import BaseHTTPRequestHandler

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        query = urllib.parse.urlparse(self.path).query
        params = urllib.parse.parse_qs(query)
        
        text = params.get('text', [''])[0].strip()
        lang = params.get('lang', ['en'])[0].strip().lower()
        
        if not text:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(b'{"error": "Missing text parameter"}')
            return

        # Map language codes to natural sounding Indian language voice tags
        tl = 'en-IN'
        if lang.startswith('mr'):
            tl = 'mr'
        elif lang.startswith('hi'):
            tl = 'hi'
        elif lang.startswith('en'):
            tl = 'en-IN'

        # Cap text length for safety
        text_chunk = text[:300]
        
        tts_url = f"https://translate.google.com/translate_tts?ie=UTF-8&tl={tl}&client=tw-ob&q={urllib.parse.quote(text_chunk)}"
        req = urllib.request.Request(
            tts_url,
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://translate.google.com/'
            }
        )

        try:
            with urllib.request.urlopen(req, timeout=5) as response:
                audio_bytes = response.read()
                
                self.send_response(200)
                self.send_header('Content-Type', 'audio/mpeg')
                self.send_header('Content-Length', str(len(audio_bytes)))
                self.send_header('Cache-Control', 'public, max-age=86400')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(audio_bytes)
        except Exception as e:
            self.send_response(502)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(f'{{"error": "Upstream TTS failed: {str(e)}"}}'.encode('utf-8'))
