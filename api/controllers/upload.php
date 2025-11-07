<?php
// CORS headers - MUST be first
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept");
header("Access-Control-Max-Age: 3600");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "../middleware/auth.php";

// Require admin authentication
try {
    $userData = Auth::requireAdmin();
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(array(
        "message" => "Authentication failed",
        "error" => $e->getMessage()
    ));
    exit();
}

try {
    // Check if file was uploaded
    if (!isset($_FILES['image'])) {
        http_response_code(400);
        echo json_encode(array("message" => "No file uploaded. Please select an image."));
        exit();
    }

    $file = $_FILES['image'];
    
    // Check for upload errors
    if ($file['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(array("message" => "File upload error: " . $file['error']));
        exit();
    }

    // Validate file type
    $allowed_types = array('image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp');
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime_type = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    if (!in_array($mime_type, $allowed_types)) {
        http_response_code(400);
        echo json_encode(array("message" => "Invalid file type. Only JPG, PNG, GIF, and WebP images are allowed."));
        exit();
    }

    // Validate file size (5MB max)
    $max_size = 5 * 1024 * 1024; // 5MB in bytes
    if ($file['size'] > $max_size) {
        http_response_code(400);
        echo json_encode(array("message" => "File too large. Maximum size is 5MB."));
        exit();
    }

    // Create uploads directory if it doesn't exist
    $upload_dir = dirname(__DIR__) . '/uploads/rooms/';
    if (!file_exists($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }

    // Generate unique filename
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid('room_', true) . '.' . $extension;
    $filepath = $upload_dir . $filename;

    // Move uploaded file
    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        // Return the relative path that will be stored in database
        $relative_path = 'uploads/rooms/' . $filename;
        
        http_response_code(200);
        echo json_encode(array(
            "message" => "File uploaded successfully.",
            "filename" => $filename,
            "path" => $relative_path,
            "url" => "http://localhost/hotel-booking/api/" . $relative_path
        ));
    } else {
        http_response_code(500);
        echo json_encode(array("message" => "Failed to move uploaded file."));
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "message" => "Upload failed: " . $e->getMessage()
    ));
}
?>
