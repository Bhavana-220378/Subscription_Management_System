@echo off
setlocal
cd /d "%~dp0"
echo =============================================
echo       SubscriptPro AI - Local Demo
echo =============================================
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Install the current Node.js LTS release first.
  pause
  exit /b 1
)
if not exist node_modules (
  echo Installing project dependencies...
  call npm.cmd install
  if errorlevel 1 (
    echo Dependency installation failed. Check your internet connection and try again.
    pause
    exit /b 1
  )
)
echo Starting SubscriptPro AI...
call npm.cmd run dev
pause
