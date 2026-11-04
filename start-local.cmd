@echo off
cd /d "%~dp0"
echo Mandi Saathi is available at http://127.0.0.1:8765/
echo Keep this window open while using the app. Press Ctrl+C to stop.
"C:\Users\staff\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" -m http.server 8765 --bind 127.0.0.1 --directory dist
