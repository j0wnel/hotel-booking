<?php
header('Content-Type: application/json');
echo json_encode([
    'status' => 'success',
    'message' => 'XAMPP is running correctly',
    'server' => $_SERVER['SERVER_SOFTWARE'],
    'php_version' => phpversion()
]);