<?php
// CORS headers - MUST be first
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept");
header("Access-Control-Max-Age: 3600");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once "../config/database.php";

try {
    $database = new Database();
    $db = $database->getConnection();
    
    if ($db === null) {
        throw new Exception("Database connection failed");
    }
    
    $method = $_SERVER['REQUEST_METHOD'];
    
    if ($method === 'GET') {
        // Get all bookings with details
        $query = "SELECT 
                    b.id,
                    b.check_in as checkIn,
                    b.check_out as checkOut,
                    b.total_price as totalPrice,
                    b.status,
                    b.created_at,
                    CONCAT('BK', LPAD(b.id, 6, '0')) as bookingId,
                    u.name as guestName,
                    u.email as guestEmail,
                    r.name as roomNumber,
                    r.type as roomType
                FROM bookings b
                LEFT JOIN users u ON b.user_id = u.id
                LEFT JOIN rooms r ON b.room_id = r.id
                ORDER BY b.created_at DESC";
        
        $stmt = $db->prepare($query);
        $stmt->execute();
        
        $bookings = array();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            array_push($bookings, $row);
        }
        
        echo json_encode($bookings);
        
    } elseif ($method === 'PUT') {
        // Update booking status
        $data = json_decode(file_get_contents("php://input"));
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(array("message" => "Invalid JSON data."));
            exit();
        }
        
        if (isset($_GET['id']) && !empty($data->status)) {
            $booking_id = $_GET['id'];
            $status = $data->status;
            
            $query = "UPDATE bookings SET status = :status WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':status', $status);
            $stmt->bindParam(':id', $booking_id);
            
            if ($stmt->execute()) {
                http_response_code(200);
                echo json_encode(array("message" => "Booking status updated."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to update booking."));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Booking ID and status are required."));
        }
    } else {
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed."));
    }
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "error" => true,
        "message" => "Server error: " . $e->getMessage()
    ));
}
?>
