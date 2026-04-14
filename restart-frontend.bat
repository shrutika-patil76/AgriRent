@echo off
echo Clearing frontend cache...
cd frontend
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo Cache cleared!
) else (
    echo No cache found to clear
)

echo.
echo ========================================
echo Frontend cache cleared!
echo.
echo Now please:
echo 1. Stop the frontend server (Ctrl+C)
echo 2. Run: npm start
echo 3. Open browser in Incognito mode
echo 4. Go to localhost:3000/dashboard
echo ========================================
pause
