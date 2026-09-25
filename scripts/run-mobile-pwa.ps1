$ErrorActionPreference = "SilentlyContinue"

$projectRoot = Split-Path -Parent $PSScriptRoot
$runtimeDirectory = Join-Path $projectRoot ".runtime"
$previewLog = Join-Path $runtimeDirectory "preview.log"
$previewErrorLog = Join-Path $runtimeDirectory "preview-error.log"
$tunnelLog = Join-Path $runtimeDirectory "tunnel.log"
$tunnelErrorLog = Join-Path $runtimeDirectory "tunnel-error.log"
$urlFile = Join-Path $runtimeDirectory "mobile-url.txt"
$cloudflared = Join-Path $runtimeDirectory "cloudflared.exe"

New-Item -ItemType Directory -Force -Path $runtimeDirectory | Out-Null

$mutex = New-Object System.Threading.Mutex(
  $false,
  "Local\CPTSD-Mobile-PWA"
)

if (-not $mutex.WaitOne(0)) {
  exit 0
}

function Test-PreviewPort {
  $client = New-Object System.Net.Sockets.TcpClient

  try {
    $client.Connect("127.0.0.1", 4173)
    return $true
  } catch {
    return $false
  } finally {
    $client.Dispose()
  }
}

$previewProcess = $null
$tunnelProcess = $null

while ($true) {
  if (-not (Test-PreviewPort)) {
    $previewProcess = Start-Process `
      -FilePath "npm.cmd" `
      -ArgumentList @(
        "run",
        "preview",
        "--",
        "--host",
        "127.0.0.1",
        "--port",
        "4173"
      ) `
      -WorkingDirectory $projectRoot `
      -WindowStyle Hidden `
      -RedirectStandardOutput $previewLog `
      -RedirectStandardError $previewErrorLog `
      -PassThru
  }

  if ($null -eq $tunnelProcess -or $tunnelProcess.HasExited) {
    $tunnelProcess = Start-Process `
      -FilePath $cloudflared `
      -ArgumentList @(
        "tunnel",
        "--url",
        "http://127.0.0.1:4173",
        "--no-autoupdate"
      ) `
      -WorkingDirectory $projectRoot `
      -WindowStyle Hidden `
      -RedirectStandardOutput $tunnelLog `
      -RedirectStandardError $tunnelErrorLog `
      -PassThru
  }

  Start-Sleep -Seconds 5

  foreach ($candidateLog in @($tunnelLog, $tunnelErrorLog)) {
    if (Test-Path -LiteralPath $candidateLog) {
      $content = Get-Content -LiteralPath $candidateLog -Raw
      $match = [regex]::Match(
        $content,
        "https://[a-z0-9-]+\.trycloudflare\.com"
      )

      if ($match.Success) {
        Set-Content -LiteralPath $urlFile -Value $match.Value
        break
      }
    }
  }

  if ($null -ne $previewProcess -and $previewProcess.HasExited) {
    $previewProcess = $null
  }
}
