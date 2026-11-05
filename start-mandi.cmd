@echo off
REM Double-click to start Mandi Saathi local app server
cd /d "%~dp0"
powershell -NoExit -Command ".\run-mandi.ps1"

