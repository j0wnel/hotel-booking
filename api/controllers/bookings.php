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

require_once "../config/database.php";
require_once "../models/booking.php";
require_once "../models/room.php";

try {
    $database = new Database();
    $db = $database->getConnection();
    
    if ($db === null) {
        throw new Exception("Database connection failed");
    }
    
    $booking = new Booking($db);
    $room = new Room($db);

    $method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        // Get bookings
        if(isset($_GET['id'])) {
            // Get single booking
            $booking->id = $_GET['id'];
            $stmt = $booking->readOne();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if($row) {
                echo json_encode($row);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Booking not found."));
            }
        } elseif(isset($_GET['user_id'])) {
            // Get bookings for a specific user
            $query = "SELECT 
                        b.*, 
                        r.name as room_name,
                        r.type as room_type
                    FROM bookings b
                    LEFT JOIN rooms r ON b.room_id = r.id
                    WHERE b.user_id = :user_id
                    ORDER BY b.created_at DESC";
            
            $stmt = $db->prepare($query);
            $stmt->bindParam(':user_id', $_GET['user_id']);
            $stmt->execute();
            
            $bookings = array();
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                array_push($bookings, $row);
            }
            
            echo json_encode($bookings);
        } else {
            // Get all bookings
            $stmt = $booking->readAll();
            $bookings = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                array_push($bookings, $row);
            }
            
            echo json_encode($bookings);
        }
        break;
        
    case 'POST':
        // Create new booking
        $data = json_decode(file_get_contents("php://input"));
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(array("message" => "Invalid JSON data."));
            break;
        }
        
        if(
            !empty($data->user_id) &&
            !empty($data->room_id) &&
            !empty($data->check_in) &&
            !empty($data->check_out) &&
            !empty($data->total_price)
        ){
            // Validate date formats
            $checkIn = DateTime::createFromFormat('Y-m-d', $data->check_in);
            $checkOut = DateTime::createFromFormat('Y-m-d', $data->check_out);
            
            if (!$checkIn || !$checkOut || $checkIn->format('Y-m-d') !== $data->check_in || $checkOut->format('Y-m-d') !== $data->check_out) {
                http_response_code(400);
                echo json_encode(array("message" => "Invalid date format. Use YYYY-MM-DD."));
                break;
            }
            
            if ($checkIn >= $checkOut) {
                http_response_code(400);
                echo json_encode(array("message" => "Check-out date must be after check-in date."));
                break;
            }
            
            // Check room availability
            $booking->room_id = $data->room_id;
            $booking->check_in = $data->check_in;
            $booking->check_out = $data->check_out;
            
            if($booking->checkAvailability()) {
                $booking->user_id = $data->user_id;
                $booking->total_price = $data->total_price;
                $booking->status = isset($data->status) ? $data->status : 'pending';
                
                if($booking->create()) {
                    http_response_code(201);
                    echo json_encode(array(
                        "message" => "Booking was created.",
                        "booking_id" => $db->lastInsertId()
                    ));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "Unable to create booking."));
                }
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "Room is not available for selected dates."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Unable to create booking. Data is incomplete."));
        }
        break;
        
    case 'PUT':
        // Update booking status
        $data = json_decode(file_get_contents("php://input"));
        
        if(isset($_GET['id']) && !empty($data->status)) {
            $booking->id = $_GET['id'];
            $booking->status = $data->status;
            
            if($booking->update()) {
                http_response_code(200);
                echo json_encode(array("message" => "Booking was updated."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to update booking."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Unable to update booking. Data is incomplete."));
        }
        break;
        
    case 'DELETE':
        // Delete booking
        if(isset($_GET['id'])) {
            $booking->id = $_GET['id'];
            
            $query = "DELETE FROM bookings WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id', $booking->id);
            
            if($stmt->execute()) {
                http_response_code(200);
                echo json_encode(array("message" => "Booking was deleted."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to delete booking."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Booking ID is required."));
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
        "message" => "Server error: " . $e->getMessage()
    ));
}
?>
