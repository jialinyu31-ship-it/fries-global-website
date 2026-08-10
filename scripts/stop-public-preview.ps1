$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$cloudflaredPath = Join-Path $projectRoot "tools\cloudflared.exe"
$stopMarker = Join-Path $projectRoot "logs\preview-stopped.marker"

New-Item -ItemType File -Force -Path $stopMarker | Out-Null

# Stop only this project's watchdog so a later restart cannot lose a mutex race
# with the previous 30-second health-check cycle.
$watchdogPath = Join-Path $PSScriptRoot "watch-public-preview.ps1"
Get-CimInstance Win32_Process |
  Where-Object {
    $_.Name -eq "powershell.exe" -and
    $_.ProcessId -ne $PID -and
    $_.CommandLine -match "-File\s+`"?.*watch-public-preview\.ps1" -and
    $_.CommandLine.Contains($watchdogPath)
  } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }

Get-Process cloudflared -ErrorAction SilentlyContinue |
  Where-Object { $_.Path -eq $cloudflaredPath } |
  Stop-Process

$listeners = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
foreach ($listener in $listeners) {
  $process = Get-CimInstance Win32_Process -Filter "ProcessId=$($listener.OwningProcess)"
  $isThisProject = $process.CommandLine -and $process.CommandLine.Contains($projectRoot)
  $isProductionNext = $process.Name -eq "node.exe" -and $process.CommandLine -match "next`"?\s+start\s+-H\s+127\.0\.0\.1\s+-p\s+3000"
  if ($isThisProject -and $isProductionNext) {
    Stop-Process -Id $listener.OwningProcess -Force
  }
}

$message = "FRIES GLOBAL public preview is stopped. Run scripts\start-public-preview.ps1 to start it again."
[IO.File]::WriteAllText((Join-Path $projectRoot "PUBLIC_PREVIEW_URL.txt"), $message, [Text.UTF8Encoding]::new($true))
