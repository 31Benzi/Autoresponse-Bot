@echo off
title AI Support Bot - Initializing
setlocal enabledelayedexpansion

:: Set working directory
cd /d "%~dp0"

echo ========================================
echo       AI Support Bot Initializer
echo ========================================
echo.

:: 1. Check if Node.js is installed
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b
)
echo [SUCCESS] Node.js is installed.

:: 2. Check for .env file
if not exist .env (
    if exist .env.example (
        echo [INFO] .env not found. Creating from .env.example...
        copy .env.example .env
        echo [WARNING] .env created. Please fill in your DISCORD_TOKEN.
        pause
    ) else (
        echo [ERROR] .env and .env.example are missing!
        pause
        exit /b
    )
)
echo [SUCCESS] .env file found.

:: 3. Check for and install dependencies (now in root)
if not exist package.json (
    echo [ERROR] package.json is missing!
    pause
    exit /b
)

if not exist node_modules (
    echo [INFO] node_modules missing. Installing all dependencies...
    call npm install
) else (
    echo [INFO] Checking for missing dependencies...
    call npm install
)

:: 4. Main Loop
:start
cls
title AI Support Bot - Running
echo Starting AI Support Bot...
:: Run index.js from the BotFiles folder
node BotFiles/index.js

:: Handle restart codes
if %errorlevel% equ 42 (
    echo.
    echo [RESTARTING] Bot requested manual restart...
    timeout /t 2 >nul
    goto start
)

:: Handle crashes
if %errorlevel% neq 0 (
    echo.
    echo [CRASH] Bot stopped with error code %errorlevel%.
    echo.
    echo 1. Restart Bot
    echo 2. Exit
    set /p choice="Select an option (1-2): "
    if "!choice!"=="1" goto start
    exit /b
)

exit
