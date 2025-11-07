<?php
// CORS headers - MUST be first
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, PUT, OPTIONS");
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

try {
    $database = new Database();
    $db = $database->getConnection();
    
    if ($db === null) {
        throw new Exception("Database connection failed");
    }

    $method = $_SERVER['REQUEST_METHOD'];
    $request_uri = $_SERVER['REQUEST_URI'];

// Parse the request
if(strpos($request_uri, '/stats') !== false) {
    // Get statistics
    if($method === 'GET') {
        try {
            // Total bookings
            $query = "SELECT COUNT(*) as total_bookings FROM bookings";
            $stmt = $db->prepare($query);
            $stmt->execute();
            $totalBookings = $stmt->fetch(PDO::FETCH_ASSOC)['total_bookings'];
            
            // Revenue
            $query = "SELECT SUM(total_price) as revenue FROM bookings WHERE status != 'cancelled'";
            $stmt = $db->prepare($query);
            $stmt->execute();
            $revenue = $stmt->fetch(PDO::FETCH_ASSOC)['revenue'] ?? 0;
            
            // Occupancy rate
            $query = "SELECT COUNT(DISTINCT room_id) as occupied_rooms FROM bookings 
                      WHERE status = 'confirmed' 
                      AND check_in <= CURDATE() 
                      AND check_out >= CURDATE()";
            $stmt = $db->prepare($query);
            $stmt->execute();
            $occupiedRooms = $stmt->fetch(PDO::FETCH_ASSOC)['occupied_rooms'];
            
            $query = "SELECT COUNT(*) as total_rooms FROM rooms";
            $stmt = $db->prepare($query);
            $stmt->execute();
            $totalRooms = $stmt->fetch(PDO::FETCH_ASSOC)['total_rooms'];
            
            $occupancyRate = $totalRooms > 0 ? round(($occupiedRooms / $totalRooms) * 100, 2) : 0;
            
            // Pending bookings
            $query = "SELECT COUNT(*) as pending_bookings FROM bookings WHERE status = 'pending'";
            $stmt = $db->prepare($query);
            $stmt->execute();
            $pendingBookings = $stmt->fetch(PDO::FETCH_ASSOC)['pending_bookings'];
            
            echo json_encode(array(
                "totalBookings" => (int)$totalBookings,
                "revenue" => (float)$revenue,
                "occupancyRate" => (float)$occupancyRate,
                "pendingBookings" => (int)$pendingBookings
            ));
        } catch(Exception $e) {
            http_response_code(500);
            echo json_encode(array("message" => "Error fetching statistics: " . $e->getMessage()));
        }
    } else {
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed."));
    }
} elseif(strpos($request_uri, '/bookings') !== false) {
    // Admin booking management
    if($method === 'GET') {
        try {
            // Get all bookings with details
            $query = "SELECT 
                        b.id,
                        b.check_in as checkIn,
                        b.check_out as checkOut,
                        b.total_price,
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
        } catch(Exception $e) {
            http_response_code(500);
            echo json_encode(array("message" => "Error fetching bookings: " . $e->getMessage()));
        }
    } elseif($method === 'PUT') {
        // Update booking status
        $data = json_decode(file_get_contents("php://input"));
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(array("message" => "Invalid JSON data."));
            return;
        }
        
        // Extract booking ID from URL
        preg_match('/\/bookings\/(\d+)\/status/', $request_uri, $matches);
        
        if(isset($matches[1]) && !empty($data->status)) {
            try {
                $booking_id = $matches[1];
                $status = $data->status;
                
                $query = "UPDATE bookings SET status = :status WHERE id = :id";
                $stmt = $db->prepare($query);
                $stmt->bindParam(':status', $status);
                $stmt->bindParam(':id', $booking_id);
                
                if($stmt->execute()) {
                    http_response_code(200);
                    echo json_encode(array("message" => "Booking status updated."));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "Unable to update booking."));
                }
            } catch(Exception $e) {
                http_response_code(500);
                echo json_encode(array("message" => "Error updating booking: " . $e->getMessage()));
            }
        } else {
            http_response_code(400);
            echo json_encode(array("message" => "Booking ID and status are required."));
        }
    } else {
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed."));
    }
} else {
    http_response_code(404);
    echo json_encode(array("message" => "Endpoint not found."));
}

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "error" => true,
        "message" => "Server error: " . $e->getMessage()
    ));
}
?>
