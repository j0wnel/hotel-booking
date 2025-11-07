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
    !empty($data->email) &&
    !empty($data->password)
){
    $user->email = $data->email;
    
    if($user->emailExists()){
        if(password_verify($data->password, $user->password)){
            $token = array(
                "iat" => time(),
                "exp" => time() + (60*60), // 1 hour expiration
                "data" => array(
                    "id" => $user->id,
                    "name" => $user->name,
                    "email" => $user->email,
                    "role" => $user->role
                )
            );

            http_response_code(200);
            echo json_encode(array(
                "message" => "Login successful.",
                "token" => base64_encode(json_encode($token)),
                "user" => array(
                    "id" => $user->id,
                    "name" => $user->name,
                    "email" => $user->email,
                    "role" => $user->role
                )
            ));
        }
        else{
            http_response_code(401);
            echo json_encode(array("message" => "Login failed."));
        }
    }
    else{
        http_response_code(401);
        echo json_encode(array("message" => "Login failed."));
    }
}
else{
    http_response_code(400);
    echo json_encode(array("message" => "Unable to login. Data is incomplete."));
}

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "error" => true,
        "message" => "Server error: " . $e->getMessage()
    ));
}
?>