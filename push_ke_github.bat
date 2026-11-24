@echo off
title Push Perubahan ke GitHub
color 0b
echo ================================================================
echo   ASRAMAKU - MENGUNGGAH PERUBAHAN KE GITHUB
echo   Repo: https://github.com/bqputri/project_suci
echo ================================================================
echo.
cd /d "%~dp0project_suci" 2>nul || cd /d "%~dp0"
git status -s
echo.
echo Sedang melakukan git push origin main...
git push origin main
echo.
if %ERRORLEVEL% equ 0 (
    echo ================================================================
    echo   BERHASIL! Perubahan sudah terkirim ke GitHub!
    echo   Workflow GitHub Actions akan otomatis aktif dan memperbarui web.
    echo ================================================================
) else (
    echo ================================================================
    echo   GAGAL PUSH! Kemungkinan perlu login / izin token GitHub.
    echo ================================================================
)
echo.
pause
