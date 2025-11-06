<?php
// CORS headers are handled by Nginx
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

require_once "../config/database.php";
require_once "../models/room.php";

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
                echo json_encode($room_arr);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Room not found."));
            }
        } else {
            $stmt = $room->read();
            $rooms_arr = array();
            
            while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
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
            
            echo json_encode($rooms_arr);
        }
        break;
        
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        if($room->create($data)) {
            http_response_code(201);
            echo json_encode(array("message" => "Room was created."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "Unable to create room."));
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed."));
        break;
}
?>