# Script para buscar imágenes en Pexels
# Requiere: API Key de Pexels (gratis en https://www.pexels.com/api/)

$apiKey = Read-Host "Ingresa tu API Key de Pexels"

$productos = @(
    "red wine bottle",
    "white wine bottle", 
    "malbec wine",
    "coca cola bottle",
    "pepsi bottle",
    "soda bottle",
    "beer bottle",
    "craft beer",
    "whiskey bottle",
    "scotch whisky"
)

$headers = @{
    "Authorization" = $apiKey
}

$resultados = @{}

foreach ($producto in $productos) {
    Write-Host "Buscando: $producto" -ForegroundColor Green
    
    $query = [uri]::EscapeDataString($producto)
    $url = "https://api.pexels.com/v1/search?query=$query&per_page=5&orientation=portrait"
    
    try {
        $response = Invoke-RestMethod -Uri $url -Headers $headers -Method Get
        
        if ($response.photos.Count -gt 0) {
            $imagen = $response.photos[0]
            $resultados[$producto] = @{
                "original" = $imagen.src.original
                "large" = $imagen.src.large
                "medium" = $imagen.src.medium
                "small" = $imagen.src.small
                "photographer" = $imagen.photographer
                "url_pexels" = $imagen.url
            }
            Write-Host "  ✓ Encontrada: $($imagen.src.medium)" -ForegroundColor Cyan
        } else {
            Write-Host "  ✗ No se encontraron imágenes" -ForegroundColor Red
        }
    } catch {
        Write-Host "  ✗ Error: $_" -ForegroundColor Red
    }
    
    Start-Sleep -Milliseconds 500
}

# Guardar resultados
$resultados | ConvertTo-Json -Depth 4 | Out-File -FilePath "imagenes_encontradas.json" -Encoding UTF8

Write-Host "`nResultados guardados en 'imagenes_encontradas.json'" -ForegroundColor Yellow
