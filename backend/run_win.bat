@echo off
setlocal EnableDelayedExpansion

set "SCRIPT_DIR=%~dp0"
set "REPO_ROOT=%SCRIPT_DIR%.."

set "tty_red="
set "tty_green="
set "tty_yellow="
set "tty_blue="
set "tty_cyan="
set "tty_purple="
set "tty_bold="
set "tty_reset="

set "RED=[0;31m"
set "GREEN=[0;32m"
set "YELLOW=[33m"
set "BLUE=[0;34m"
set "CYAN=[0;36m"
set "LIGHT_GRAY=[0;37m"
set "PURPLE=[0;35m"
set "BOLD=[1m"
set "RESET=[0m"

set "ERROR_COUNT=0"

goto :main_menu

:info
echo !tty_green!OK: %~1!tty_reset!
goto :eof

:warn
echo !tty_yellow!WARNING: %~1!tty_reset!
goto :eof

:error
echo !tty_red!ERROR: %~1!tty_reset!
goto :eof

:pause
pause
goto :eof

:print_separator
echo !LIGHT_GRAY!---------------------------------------------------------------!RESET!
goto :eof

:show_banner
echo.
echo  Welcome to FastAPI Init Script
echo  Version: 1.0.0
echo  Author: coderxslee
echo.
goto :eof

:load_db_config
set "env_file=%SCRIPT_DIR%env\.env.dev"

if not exist "%env_file%" (
    call :error "Not found: %env_file%"
    exit /b 1
)

for /f "usebackq tokens=1,* delims==" %%a in ("%env_file%") do (
    set "line=%%a"
    set "value=%%b"
    set "line=!line:~0,13!"
    if "!line!"=="DATABASE_HOST" set "DATABASE_HOST=%%b"
    if "!line!"=="DATABASE_PORT" set "DATABASE_PORT=%%b"
    if "!line!"=="DATABASE_USER" set "DATABASE_USER=%%b"
    if "!line!"=="DATABASE_PASSWORD" set "DATABASE_PASSWORD=%%b"
    if "!line!"=="DATABASE_NAME" set "DATABASE_NAME=%%b"
    if "!line!"=="DATABASE_TYPE" set "DATABASE_TYPE=%%b"
)

if "!DATABASE_HOST!"=="" (
    call :error "Database configuration incomplete"
    exit /b 1
)
exit /b 0

:start_dev_server
call :print_separator
echo Starting dev server...
call :load_db_config
if errorlevel 1 exit /b 1

echo Checking database...
echo Database host: !DATABASE_HOST!
echo Database port: !DATABASE_PORT!
echo Database user: !DATABASE_USER!
echo Database name: !DATABASE_NAME!

call :print_separator
cd /d "%SCRIPT_DIR%"
uv run main.py run --env=dev
exit /b 0

:create_migration
call :print_separator
echo Generating migration files...
cd /d "%SCRIPT_DIR%"
uv run main.py revision --env=dev
exit /b 0

:apply_migration
call :print_separator
echo Applying migrations...
cd /d "%SCRIPT_DIR%"
uv run main.py upgrade --env=dev
exit /b 0

:reset_migration_records
call :print_separator
echo Resetting migration records...
echo WARNING: This will reset migration records in the database!
set /p confirm="Continue? (y/N): "
if /i not "!confirm!"=="y" (
    echo Operation cancelled
    exit /b 0
)

call :load_db_config
if errorlevel 1 exit /b 1

cd /d "%SCRIPT_DIR%"
echo Resetting migration records...
echo DELETE FROM alembic_version; | PGPASSWORD=%DATABASE_PASSWORD% psql -h %DATABASE_HOST% -p %DATABASE_PORT% -U %DATABASE_USER% -d %DATABASE_NAME%
exit /b 0

:clean_database
call :print_separator
echo Cleaning database...
echo WARNING: This will delete all tables in the database!
set /p confirm="Continue? (y/N): "
if /i not "!confirm!"=="y" (
    echo Operation cancelled
    exit /b 0
)

call :load_db_config
if errorlevel 1 exit /b 1

cd /d "%SCRIPT_DIR%"
echo Cleaning database, dropping all tables...
echo DROP SCHEMA public CASCADE; CREATE SCHEMA public; | PGPASSWORD=%DATABASE_PASSWORD% psql -h %DATABASE_HOST% -p %DATABASE_PORT% -U %DATABASE_USER% -d %DATABASE_NAME%
exit /b 0

:drop_database
call :print_separator
echo Deleting database...
set /p db_name="Enter database name: "

if "!db_name!"=="" (
    call :error "Database name cannot be empty"
    exit /b 1
)

echo WARNING: This will permanently delete database '!db_name!' and all its data!
echo This action cannot be undone!

set /p confirm1="Confirm deletion of '!db_name!'? (y/N): "
if /i not "!confirm1!"=="y" (
    echo Operation cancelled
    exit /b 0
)

set /p confirm2="Enter 'DELETE' to confirm: "
if not "!confirm2!"=="DELETE" (
    echo Operation cancelled
    exit /b 0
)

call :load_db_config
if errorlevel 1 exit /b 1

cd /d "%SCRIPT_DIR%"
echo Dropping database '!db_name!'...
echo SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '!db_name!' AND pid <> pg_backend_pid(); | PGPASSWORD=%DATABASE_PASSWORD% psql -h %DATABASE_HOST% -p %DATABASE_PORT% -U %DATABASE_USER% -d postgres
echo DROP DATABASE IF EXISTS "!db_name!"; | PGPASSWORD=%DATABASE_PASSWORD% psql -h %DATABASE_HOST% -p %DATABASE_PORT% -U %DATABASE_USER% -d postgres
exit /b 0

:init_sql_data
call :print_separator
echo Initializing SQL data...

set "sql_dir=%REPO_ROOT%\backend\sql\postgres\init_data"

if not exist "%sql_dir%" (
    call :error "SQL directory not found: %sql_dir%"
    exit /b 1
)

echo Available SQL files:
echo 0. Execute all SQL files

set "i=0"
set "file_count=0"
for %%f in ("%sql_dir%\*.sql") do (
    set /a file_count+=1
    echo !file_count!. %%~nxf
)

set /p choice="Select SQL to initialize (enter number): "

call :load_db_config
if errorlevel 1 exit /b 1

if "!choice!"=="0" (
    echo Executing all SQL files...
    for %%f in ("%sql_dir%\*.sql") do (
        echo Executing: %%~nxf
        PGPASSWORD=%DATABASE_PASSWORD% psql -h %DATABASE_HOST% -p %DATABASE_PORT% -U %DATABASE_USER% -d %DATABASE_NAME% -f "%%f"
    )
) else (
    set /a index=choice-1
    set "selected_file="
    set "j=0"
    for %%f in ("%sql_dir%\*.sql") do (
        if "!j!"=="!index!" (
            set "selected_file=%%f"
        )
        set /a j+=1
    )
    if "!selected_file!"=="" (
        call :error "Invalid selection"
        exit /b 1
    )
    echo Executing: !selected_file!
    PGPASSWORD=%DATABASE_PASSWORD% psql -h %DATABASE_HOST% -p %DATABASE_PORT% -U %DATABASE_USER% -d %DATABASE_NAME% -f "!selected_file!"
)
exit /b 0

:main_menu
cls
call :show_banner
echo Please select an operation:
echo.
echo 1. Start dev server (uv run dev)
echo 2. Generate migration files
echo 3. Apply migrations
echo 4. Reset migration records
echo 5. Clean database (drop all tables)
echo 6. Delete database
echo 7. Initialize SQL data
echo 0. Exit
echo.

set /p option="Select operation: "

if "!option!"=="1" call :start_dev_server
if "!option!"=="2" call :create_migration
if "!option!"=="3" call :apply_migration
if "!option!"=="4" call :reset_migration_records
if "!option!"=="5" call :clean_database
if "!option!"=="6" call :drop_database
if "!option!"=="7" call :init_sql_data
if "!option!"=="0" exit /b 0

call :pause
goto :main_menu

:end
endlocal
exit /b 0
