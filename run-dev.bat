@echo off
REM Starts server and client in separate command windows (Windows)
start "Server" cmd /k "cd /d %~dp0server && npm start"
start "Client" cmd /k "cd /d %~dp0client && npm run dev"
