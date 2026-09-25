$ErrorActionPreference = "SilentlyContinue"

$taskName = "CPTSD-Mobile-PWA"

Stop-ScheduledTask -TaskName $taskName
Unregister-ScheduledTask -TaskName $taskName -Confirm:$false

Get-Process cloudflared | Stop-Process -Force

Get-CimInstance Win32_Process |
  Where-Object {
    $_.CommandLine -like "*run-mobile-pwa.ps1*"
  } |
  ForEach-Object {
    Stop-Process -Id $_.ProcessId -Force
  }

Write-Output "CPTSD mobile service removed."
