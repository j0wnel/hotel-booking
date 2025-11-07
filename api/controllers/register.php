<?php
// CORS headers - MUST be first
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept");
header("Access-Control-Max-Age: 3600");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request BEFORE any other code
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../config/database.php';
include_once '../models/user.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    if ($db === null) {
        throw new Exception("Database connection failed");
    }
    
    $user = new User($db);

    $data = json_decode(file_get_contents("php://input"));
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Invalid JSON data");
    }

if(
    !empty($data->name) &&
    !empty($data->email) &&
    !empty($data->password)
){
    // Check if email already exists
    $user->email = $data->email;
    
    if($user->emailExists()){
        http_response_code(400);
        echo json_encode(array("message" => "Email already exists."));
    } else {
        // Create new user
        $user->name = $data->name;
        $user->email = $data->email;
        $user->password = $data->password;
        $user->role = isset($data->role) ? $data->role : 'user';

        if($user->create()){
            http_response_code(201);
            echo json_encode(array("message" => "User was created."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to create user."));
        }
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Unable to create user. Data is incomplete."));
}

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "error" => true,
        "message" => "Server error: " . $e->getMessage()
    ));
}
?>
