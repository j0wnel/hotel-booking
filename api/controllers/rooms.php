<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

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
            $result = $room->read_one();
        } else {
            $result = $room->read();
        }
        echo json_encode($result);
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