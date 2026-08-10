$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$logDirectory = Join-Path $projectRoot "logs"
$siteOutputLog = Join-Path $logDirectory "site-output.log"
$siteErrorLog = Join-Path $logDirectory "site-error.log"
$tunnelOutputLog = Join-Path $logDirectory "tunnel-output.log"
$tunnelErrorLog = Join-Path $logDirectory "tunnel-error.log"
$addressFile = Join-Path $projectRoot "PUBLIC_PREVIEW_URL.txt"
$cloudflaredPath = Join-Path $projectRoot "tools\cloudflared.exe"
$desktopPath = [Environment]::GetFolderPath("Desktop")
$desktopAddressFile = Join-Path $desktopPath "FriesGlobal-Public-Preview.txt"

New-Item -ItemType Directory -Force -Path $logDirectory | Out-Null

function Write-AddressStatus([string]$message) {
  $content = "FRIES GLOBAL - PUBLIC TEST PREVIEW`r`n`r`n$message`r`n`r`nThis is a temporary test URL. Keep this PC powered on and connected to the Internet. The URL can change when the tunnel restarts.`r`n"
  [IO.File]::WriteAllText($addressFile, $content, [Text.UTF8Encoding]::new($true))
  [IO.File]::WriteAllText($desktopAddressFile, $content, [Text.UTF8Encoding]::new($true))
}

try {
  $listener = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
  if (-not $listener) {
    $npmPath = (Get-Command npm.cmd -ErrorAction Stop).Source
    Start-Process -FilePath $npmPath `
      -ArgumentList "run", "start" `
      -WorkingDirectory $projectRoot `
      -RedirectStandardOutput $siteOutputLog `
      -RedirectStandardError $siteErrorLog `
      -WindowStyle Hidden

    $siteReady = $false
    for ($attempt = 0; $attempt -lt 30; $attempt += 1) {
      Start-Sleep -Seconds 1
      try {
        $response = Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:3000/en" -TimeoutSec 2
        if ($response.StatusCode -eq 200) { $siteReady = $true; break }
      } catch { }
    }
    if (-not $siteReady) { throw "The site did not start within 30 seconds." }
  }

  $existingTunnel = Get-Process cloudflared -ErrorAction SilentlyContinue |
    Where-Object { $_.Path -eq $cloudflaredPath } |
    Select-Object -First 1

  if (-not $existingTunnel) {
    Remove-Item -LiteralPath $tunnelOutputLog, $tunnelErrorLog -Force -ErrorAction SilentlyContinue
    Start-Process -FilePath $cloudflaredPath `
      -ArgumentList "tunnel", "--url", "http://127.0.0.1:3000", "--no-autoupdate" `
      -WorkingDirectory $projectRoot `
      -RedirectStandardOutput $tunnelOutputLog `
      -RedirectStandardError $tunnelErrorLog `
      -WindowStyle Hidden
  }

  $publicUrl = $null
  for ($attempt = 0; $attempt -lt 45; $attempt += 1) {
    Start-Sleep -Seconds 1
    $logs = @()
    if (Test-Path -LiteralPath $tunnelOutputLog) { $logs += Get-Content -LiteralPath $tunnelOutputLog -Raw }
    if (Test-Path -LiteralPath $tunnelErrorLog) { $logs += Get-Content -LiteralPath $tunnelErrorLog -Raw }
    $match = [regex]::Match(($logs -join "`n"), "https://[a-z0-9-]+\.trycloudflare\.com")
    if ($match.Success) { $publicUrl = $match.Value; break }
  }

  if (-not $publicUrl) { throw "The temporary public tunnel did not start within 45 seconds." }

  $verified = $false
  for ($attempt = 0; $attempt -lt 10; $attempt += 1) {
    try {
      $response = Invoke-WebRequest -UseBasicParsing $publicUrl -TimeoutSec 8
      if ($response.StatusCode -eq 200) { $verified = $true; break }
    } catch { Start-Sleep -Seconds 2 }
  }
  if (-not $verified) { throw "The tunnel was created but public verification failed: $publicUrl" }

  Write-AddressStatus "Current public URL: $publicUrl`r`nStatus: RUNNING AND VERIFIED"
} catch {
  Write-AddressStatus "Startup failed: $($_.Exception.Message)`r`nCheck: $siteErrorLog and $tunnelErrorLog"
  exit 1
}
