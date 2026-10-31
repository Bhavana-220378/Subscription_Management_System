@echo off
setlocal
cd /d "%~dp0"
if not exist node_modules call npm.cmd install
if errorlevel 1 goto failed
call npm.cmd run build
if errorlevel 1 goto failed
echo.
echo Build complete. Upload the contents of the dist folder to your hosting provider.
pause
exit /b 0
:failed
echo Build failed. Read the error above before deploying.
pause
exit /b 1
