@echo off
rem Dev server wrapper: pins portable Node 20 ahead of the system Node 14 so
rem Next/Turbopack child processes all resolve the right runtime.
set "PATH=C:\Users\ksyedabdul\Node20\node-v20.20.2-win-x64;%PATH%"
cd /d C:\Users\ksyedabdul\dev\be-weird-portfolio
node node_modules\next\dist\bin\next dev -p 3213
