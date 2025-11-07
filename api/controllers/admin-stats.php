<?php
// CORS headers - MUST be first
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
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
    
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        http_response_code(405);
        echo json_encode(array("message" => "Method not allowed."));
        exit();
    }
    
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
    echo json_encode(array(
        "error" => true,
        "message" => "Server error: " . $e->getMessage()
    ));
}
?>
