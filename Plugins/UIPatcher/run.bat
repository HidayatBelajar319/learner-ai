@echo off
title UIPatcher - LearnerAI UI Detection Tool
color 0A

echo ============================================
echo   UIPatcher - LearnerAI UI Detection Tool
echo ============================================
echo.

cd /d "%~dp0"

echo [1/3] Memeriksa Node.js...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js tidak ditemukan. Install dari https://nodejs.org
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do echo       Node.js: %%i

echo.
echo [2/3] Menginstal dependensi...
if not exist "node_modules\" (
    echo       node_modules tidak ditemukan, menjalankan npm install...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] npm install gagal.
        pause
        exit /b 1
    )
) else (
    echo       node_modules sudah ada, lewati instalasi.
)

echo.
echo [3/3] Menjalankan UIPatcher...
echo.
echo Penggunaan:
echo   node capture.mjs [url] [output.png] [--full]
echo.
echo Contoh:
echo   node capture.mjs http://localhost:5173 screenshot.png
echo   node capture.mjs http://localhost:5173/dashboard dash.png --full
echo.

set /p URL="Masukkan URL target (default: http://localhost:5173): "
if "%URL%"=="" set URL=http://localhost:5173

set /p OUT="Nama file output (default: screenshot.png): "
if "%OUT%"=="" set OUT=screenshot.png

set /p FULL="Mode halaman penuh? (y/N): "
if /i "%FULL%"=="y" (
    node capture.mjs "%URL%" "%OUT%" --full
) else (
    node capture.mjs "%URL%" "%OUT%"
)

echo.
if %errorlevel% equ 0 (
    echo [OK] Screenshot berhasil disimpan di folder output\
) else (
    echo [ERROR] Screenshot gagal. Pastikan server berjalan di URL tersebut.
)

echo.
pause
