$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$runtimeDirectory = Join-Path $projectRoot ".runtime"
$cloudflaredSource = Join-Path $env:TEMP "cloudflared.exe"
$cloudflaredTarget = Join-Path $runtimeDirectory "cloudflared.exe"
$runner = Join-Path $PSScriptRoot "run-mobile-pwa.ps1"
$taskName = "CPTSD-Mobile-PWA"

New-Item -ItemType Directory -Force -Path $runtimeDirectory | Out-Null

if (-not (Test-Path -LiteralPath $cloudflaredTarget)) {
  if (-not (Test-Path -LiteralPath $cloudflaredSource)) {
    throw "cloudflared.exe is missing."
  }

  Copy-Item -LiteralPath $cloudflaredSource -Destination $cloudflaredTarget
}

$action = New-ScheduledTaskAction `
  -Execute "powershell.exe" `
  -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$runner`""

$trigger = New-ScheduledTaskTrigger -AtLogOn -User $env:USERNAME

$settings = New-ScheduledTaskSettingsSet `
  -AllowStartIfOnBatteries `
  -DontStopIfGoingOnBatteries `
  -DontStopOnIdleEnd `
  -ExecutionTimeLimit ([TimeSpan]::Zero) `
  -MultipleInstances IgnoreNew `
  -StartWhenAvailable `
  -RestartCount 5 `
  -RestartInterval (New-TimeSpan -Minutes 1)

Register-ScheduledTask `
  -TaskName $taskName `
  -Action $action `
  -Trigger $trigger `
  -Settings $settings `
  -Description "Keep the local CPTSD PWA preview and HTTPS tunnel running." `
  -Force | Out-Null

Start-ScheduledTask -TaskName $taskName

$deadline = (Get-Date).AddSeconds(45)
$urlFile = Join-Path $runtimeDirectory "mobile-url.txt"

while ((Get-Date) -lt $deadline) {
  if (Test-Path -LiteralPath $urlFile) {
    $url = (Get-Content -LiteralPath $urlFile -Raw).Trim()

    if ($url) {
      Write-Output $url
      exit 0
    }
  }

  Start-Sleep -Seconds 2
}

throw "The mobile service started, but no public URL was generated in time."
