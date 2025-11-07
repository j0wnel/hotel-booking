<?php
// CORS headers - MUST be first
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept");
header("Access-Control-Max-Age: 3600");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request BEFORE any other code
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Ensure errors are returned as JSON
error_reporting(E_ALL);
ini_set('display_errors', 0);
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => $errstr,
        'file' => basename($errfile),
        'line' => $errline
    ]);
    exit;
});

require_once "../config/database.php";
require_once "../models/room.php";
require_once "../middleware/auth.php";

try {
    $database = new Database();
    $db = $database->getConnection();
    $room = new Room($db);

    $method = $_SERVER['REQUEST_METHOD'];

    switch($method) {
        case 'GET':
            if(isset($_GET['id'])) {
                $room->id = $_GET['id'];
                if($room->readOne()) {
                    $room_arr = array(
                        "id" => $room->id,
                        "name" => $room->name,
                        "description" => $room->description,
                        "price" => $room->price,
                        "type" => $room->type,
                        "capacity" => $room->capacity,
                        "image" => $room->image,
                        "status" => $room->status
                    );
                    http_response_code(200);
                    echo json_encode($room_arr);
                } else {
                    http_response_code(404);
                    echo json_encode(array("message" => "Room not found."));
                }
            } else {
                $stmt = $room->read();
                $rooms_arr = array();
                
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    extract($row);
                    $room_item = array(
                        "id" => $id,
                        "name" => $name,
                        "description" => $description,
                        "price" => $price,
                        "type" => $type,
                        "capacity" => $capacity,
                        "image" => $image,
                        "status" => $status
                    );
                    array_push($rooms_arr, $room_item);
                }
                
                http_response_code(200);
                echo json_encode($rooms_arr);
            }
            break;
        
    case 'POST':
        // Require admin authentication
        Auth::requireAdmin();
        
        $data = json_decode(file_get_contents("php://input"));
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(array("message" => "Invalid JSON data."));
            break;
        }
        
        if($room->create($data)) {
            http_response_code(201);
            echo json_encode(array(
                "message" => "Room was created.",
                "id" => $db->lastInsertId()
            ));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to create room."));
        }
        break;
    
    case 'PUT':
        // Require admin authentication
        Auth::requireAdmin();
        
        $data = json_decode(file_get_contents("php://input"));
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(array("message" => "Invalid JSON data."));
            break;
        }
        
        if(isset($_GET['id'])) {
            $room->id = $_GET['id'];
            $room->name = $data->name;
            $room->description = $data->description;
            $room->price = $data->price;
            $room->type = $data->type;
            $room->capacity = $data->capacity;
            $room->image = $data->image ?? 'default.jpg';
            $room->status = $data->status ?? 'available';
            
            if($room->update()) {
                http_response_code(200);
                echo json_encode(array("message" => "Room was updated."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to update room."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Room ID is required."));
        }
        break;
    
    case 'DELETE':
        // Require admin authentication
        Auth::requireAdmin();
        
        if(isset($_GET['id'])) {
            $room->id = $_GET['id'];
            
            if($room->delete()) {
                http_response_code(200);
                echo json_encode(array("message" => "Room was deleted."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to delete room."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Room ID is required."));
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed."));
        break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "error" => true,
        "message" => $e->getMessage()
    ));
}
?>