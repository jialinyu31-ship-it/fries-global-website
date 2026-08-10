$ErrorActionPreference = "Continue"

$projectRoot = Split-Path -Parent $PSScriptRoot
$startScript = Join-Path $PSScriptRoot "start-public-preview.ps1"
$stopMarker = Join-Path $projectRoot "logs\preview-stopped.marker"
$cloudflaredPath = Join-Path $projectRoot "tools\cloudflared.exe"
$mutex = [Threading.Mutex]::new($false, "Local\FriesGlobalPreviewWatchdogV2")
$ownsMutex = $false

try {
  $ownsMutex = $mutex.WaitOne(0, $false)
} catch [Threading.AbandonedMutexException] {
  # A previous watchdog was stopped while holding the mutex. Ownership passes
  # to this process, so recovery should continue instead of exiting.
  $ownsMutex = $true
}

if (-not $ownsMutex) {
  $mutex.Dispose()
  exit 0
}

try {
  Remove-Item -LiteralPath $stopMarker -Force -ErrorAction SilentlyContinue

  while (-not (Test-Path -LiteralPath $stopMarker)) {
    $siteHealthy = $false
    try {
      $response = Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:3000/en" -TimeoutSec 4
      $siteHealthy = $response.StatusCode -eq 200
    } catch { }

    $tunnelHealthy = [bool](Get-Process cloudflared -ErrorAction SilentlyContinue |
      Where-Object { $_.Path -eq $cloudflaredPath } |
      Select-Object -First 1)

    if (-not $siteHealthy -or -not $tunnelHealthy) {
      & powershell.exe -NoProfile -ExecutionPolicy Bypass -File $startScript
    }

    Start-Sleep -Seconds 30
  }
} finally {
  if ($ownsMutex) { $mutex.ReleaseMutex() }
  $mutex.Dispose()
}
