@echo off
echo Starting MongoDB...
start "MongoDB Server" D:\MongoDB\Server\8.0\bin\mongod.exe
echo MongoDB started in a new window!
echo.
echo Press any key to close this window...
pause > nul
