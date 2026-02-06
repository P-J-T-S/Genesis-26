$uri = "http://localhost:5000/api/v1/zones/status"
Start-Sleep -Seconds 2
Write-Host "Testing: GET /api/v1/zones/status`n"

try {
    $response = Invoke-WebRequest -Uri $uri -Method Get -UseBasicParsing
    $json = $response.Content | ConvertFrom-Json
    
    Write-Host "✅ TEST 1: GET /zones/status"
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Mode: $($json.data.mode)"
    Write-Host "Total Zones: $($json.data.zones.Count)"
    Write-Host ""
    
    # Show top critical zone
    if ($json.data.zones.Count -gt 0) {
        $top = $json.data.zones[0]
        Write-Host "Top Critical Zone:"
        Write-Host "  - Name: $($top.zone_name)"
        Write-Host "  - WPI Score: $($top.wpi_score)"
        Write-Host "  - Color: $($top.status_color)"
        Write-Host "  - Rank: $($top.priority_rank)"
    }
    
    Write-Host "`n✅ TEST 2: GET /zones (all zones)"
    $zonesUri = "http://localhost:5000/api/v1/zones"
    $zonesResponse = Invoke-WebRequest -Uri $zonesUri -Method Get -UseBasicParsing
    $zonesJson = $zonesResponse.Content | ConvertFrom-Json
    Write-Host "Zones found: $($zonesJson.data.Count)"
    $zonesJson.data | Select-Object zone_name, is_hotspot | Format-Table
    
    Write-Host "`n✅ TEST 3: GET /dashboard/summary"
    $dashUri = "http://localhost:5000/api/v1/zones/dashboard/summary"
    $dashResponse = Invoke-WebRequest -Uri $dashUri -Method Get -UseBasicParsing
    $dashJson = $dashResponse.Content | ConvertFrom-Json
    Write-Host "Color Distribution:"
    Write-Host $dashJson.data.color_counts | ConvertTo-Json
    Write-Host "Blinking Zones: $($dashJson.data.blinking_zones)"
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)"
}
