# ============================================================
# run-mandi.ps1 -- Automated Launcher for Mandi Saathi
# ============================================================

cd $PSScriptRoot

# Automatically load from set-keys.ps1 if present in parent folder
if (Test-Path "..\set-keys.ps1") {
    . "..\set-keys.ps1" | Out-Null
}

if (-not $env:DATA_GOV_IN_KEY -or $env:DATA_GOV_IN_KEY.Trim() -eq "") {
    Write-Host ""
    Write-Host "[Note] DATA_GOV_IN_KEY not found in set-keys.ps1." -ForegroundColor Yellow
    $keyInput = Read-Host "Paste your key (or press Enter to run offline fallback)"
    if ($keyInput.Trim() -ne "") {
        $env:DATA_GOV_IN_KEY = $keyInput.Trim()
    }
}

python server.py
