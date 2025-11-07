$ports = @(80, 443, 3306)

foreach ($port in $ports) {
    $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue |
        Select-Object LocalPort, State, OwningProcess
    
    if ($process) {
        $processName = (Get-Process -Id $process.OwningProcess).Name
        Write-Host "Port $port is in use by process: $processName (PID: $($process.OwningProcess))"
    } else {
        Write-Host "Port $port is available"
    }
}