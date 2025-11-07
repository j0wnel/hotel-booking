<?php
// Disable error reporting for response
error_reporting(0);
ini_set('display_errors', 0);

// Set JSON header
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Test database connection
function testDatabase() {
    try {
        $conn = new PDO(
            "mysql:host=localhost;dbname=hotel_booking",
            "root",
            ""
        );
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return true;
    } catch(PDOException $e) {
        return false;
    }
}

// Build response
$response = [
    'status' => 'active',
    'timestamp' => date('Y-m-d H:i:s'),
    'server' => [
        'software' => $_SERVER['SERVER_SOFTWARE'] ?? 'unknown',
        'php_version' => PHP_VERSION,
        'document_root' => $_SERVER['DOCUMENT_ROOT'],
        'server_port' => $_SERVER['SERVER_PORT']
    ],
    'database' => [
        'connected' => testDatabase()
    ]
];

echo json_encode($response);