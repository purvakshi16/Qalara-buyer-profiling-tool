param(
  [string]$InstallRoot = "$PSScriptRoot\..\.tools"
)

$ErrorActionPreference = "Stop"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$InstallRoot = (New-Item -ItemType Directory -Force -Path $InstallRoot).FullName
$Downloads = New-Item -ItemType Directory -Force -Path (Join-Path $InstallRoot "downloads")

function Download($Url, $OutFile) {
  Write-Host "Downloading $Url"
  Invoke-WebRequest -Uri $Url -OutFile $OutFile
}

function ExpandClean($ZipPath, $Destination) {
  if (Test-Path $Destination) {
    Remove-Item -LiteralPath $Destination -Recurse -Force
  }
  New-Item -ItemType Directory -Force -Path $Destination | Out-Null
  Expand-Archive -LiteralPath $ZipPath -DestinationPath $Destination -Force
}

function FirstChildDirectory($Path) {
  return (Get-ChildItem -LiteralPath $Path -Directory | Select-Object -First 1).FullName
}

Write-Host "Installing portable Node.js LTS..."
$NodeIndex = Invoke-RestMethod -Uri "https://nodejs.org/dist/index.json"
$NodeVersion = ($NodeIndex | Where-Object { $_.lts -ne $false } | Select-Object -First 1).version
$NodeZip = Join-Path $Downloads "node-$NodeVersion-win-x64.zip"
Download "https://nodejs.org/dist/$NodeVersion/node-$NodeVersion-win-x64.zip" $NodeZip
$NodeExtract = Join-Path $InstallRoot "node-extract"
ExpandClean $NodeZip $NodeExtract
$NodeHome = Join-Path $InstallRoot "node"
if (Test-Path $NodeHome) { Remove-Item -LiteralPath $NodeHome -Recurse -Force }
Move-Item -LiteralPath (FirstChildDirectory $NodeExtract) -Destination $NodeHome

Write-Host "Installing portable Eclipse Temurin JDK 21..."
$JdkZip = Join-Path $Downloads "temurin-jdk-21.zip"
Download "https://api.adoptium.net/v3/binary/latest/21/ga/windows/x64/jdk/hotspot/normal/eclipse" $JdkZip
$JdkExtract = Join-Path $InstallRoot "jdk-extract"
ExpandClean $JdkZip $JdkExtract
$JavaHome = Join-Path $InstallRoot "jdk-21"
if (Test-Path $JavaHome) { Remove-Item -LiteralPath $JavaHome -Recurse -Force }
Move-Item -LiteralPath (FirstChildDirectory $JdkExtract) -Destination $JavaHome

Write-Host "Installing Apache Maven..."
$MavenVersion = "3.9.11"
$MavenZip = Join-Path $Downloads "apache-maven-$MavenVersion-bin.zip"
Download "https://dlcdn.apache.org/maven/maven-3/$MavenVersion/binaries/apache-maven-$MavenVersion-bin.zip" $MavenZip
$MavenExtract = Join-Path $InstallRoot "maven-extract"
ExpandClean $MavenZip $MavenExtract
$MavenHome = Join-Path $InstallRoot "maven"
if (Test-Path $MavenHome) { Remove-Item -LiteralPath $MavenHome -Recurse -Force }
Move-Item -LiteralPath (FirstChildDirectory $MavenExtract) -Destination $MavenHome

Write-Host "Installing Portable Git..."
$GitRelease = Invoke-RestMethod -Uri "https://api.github.com/repos/git-for-windows/git/releases/latest" -Headers @{ "User-Agent" = "Codex" }
$GitAsset = $GitRelease.assets | Where-Object { $_.name -match "^PortableGit-.*-64-bit\.7z\.exe$" } | Select-Object -First 1
if (-not $GitAsset) {
  throw "Could not find a PortableGit 64-bit asset in the latest Git for Windows release."
}
$GitInstaller = Join-Path $Downloads $GitAsset.name
Download $GitAsset.browser_download_url $GitInstaller
$GitHome = Join-Path $InstallRoot "git"
if (Test-Path $GitHome) { Remove-Item -LiteralPath $GitHome -Recurse -Force }
New-Item -ItemType Directory -Force -Path $GitHome | Out-Null
Start-Process -FilePath $GitInstaller -ArgumentList "-y", "-o$GitHome" -Wait -WindowStyle Hidden

$PathEntries = @(
  (Join-Path $NodeHome ""),
  (Join-Path $JavaHome "bin"),
  (Join-Path $MavenHome "bin"),
  (Join-Path $GitHome "cmd"),
  (Join-Path $GitHome "bin")
)

$UserPath = [Environment]::GetEnvironmentVariable("Path", "User")
$Existing = @()
if ($UserPath) {
  $Existing = $UserPath -split ";"
}
$Updated = @($PathEntries + $Existing) | Where-Object { $_ -and $_.Trim() } | Select-Object -Unique
[Environment]::SetEnvironmentVariable("Path", ($Updated -join ";"), "User")
[Environment]::SetEnvironmentVariable("JAVA_HOME", $JavaHome, "User")
[Environment]::SetEnvironmentVariable("MAVEN_HOME", $MavenHome, "User")

$EnvFile = Join-Path (Split-Path $InstallRoot -Parent) ".dev-env.ps1"
@"
`$env:PATH = "$($PathEntries -join ';');`$env:PATH"
`$env:JAVA_HOME = "$JavaHome"
`$env:MAVEN_HOME = "$MavenHome"
"@ | Set-Content -LiteralPath $EnvFile -Encoding UTF8

Write-Host ""
Write-Host "Installed developer tools:"
& (Join-Path $NodeHome "node.exe") --version
& (Join-Path $NodeHome "npm.cmd") --version
& (Join-Path $JavaHome "bin\java.exe") -version
& (Join-Path $MavenHome "bin\mvn.cmd") -version
& (Join-Path $GitHome "cmd\git.exe") --version
Write-Host ""
Write-Host "For this shell, run: . .\.dev-env.ps1"
Write-Host "New terminals should pick up the user PATH automatically."
