# Copy ICON-LOGO-lg.png to project root and (optionally) create favicon.ico
# Run from project root: powershell -ExecutionPolicy Bypass -File .\scripts\create-favicon.ps1

$src = Join-Path -Path (Get-Location) -ChildPath "img\ICON-LOGO-lg.png"
$destPng = Join-Path -Path (Get-Location) -ChildPath "ICON-LOGO-lg.png"

if (Test-Path $src) {
    Copy-Item -Path $src -Destination $destPng -Force
    Write-Host "Copied $src -> $destPng"
} else {
    Write-Host "Source file not found: $src" -ForegroundColor Yellow
    exit 1
}

# If ImageMagick is installed (magick), create a multi-size favicon.ico
# Uncomment the following block if you have ImageMagick available

# if (Get-Command magick -ErrorAction SilentlyContinue) {
#     magick $destPng -define icon:auto-resize=256,128,64,48,32,16 .\favicon.ico
#     Write-Host "Created favicon.ico from $destPng"
# } else {
#     Write-Host "ImageMagick (magick) not found. To create favicon.ico, install ImageMagick or use an online converter." -ForegroundColor Yellow
# }
