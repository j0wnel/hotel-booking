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
require_once "../middleware/auth.php";

// Require admin authentication
Auth::requireAdmin();

try {
    $database = new Database();
    $db = $database->getConnection();

    // Get date range from query params (default: last 30 days)
    $endDate = isset($_GET['endDate']) ? $_GET['endDate'] : date('Y-m-d');
    $startDate = isset($_GET['startDate']) ? $_GET['startDate'] : date('Y-m-d', strtotime('-30 days'));

    $reports = array();

    // 1. Revenue Statistics
    $revenueQuery = "SELECT 
        COUNT(*) as total_bookings,
        SUM(total_price) as total_revenue,
        AVG(total_price) as average_booking_value,
        SUM(CASE WHEN status = 'confirmed' THEN total_price ELSE 0 END) as confirmed_revenue,
        SUM(CASE WHEN status = 'completed' THEN total_price ELSE 0 END) as completed_revenue
    FROM bookings 
    WHERE created_at BETWEEN ? AND ?";
    
    $stmt = $db->prepare($revenueQuery);
    $stmt->execute(array($startDate, $endDate));
    $reports['revenue'] = $stmt->fetch(PDO::FETCH_ASSOC);

    // 2. Booking Status Breakdown
    $statusQuery = "SELECT 
        status,
        COUNT(*) as count,
        SUM(total_price) as revenue
    FROM bookings 
    WHERE created_at BETWEEN ? AND ?
    GROUP BY status";
    
    $stmt = $db->prepare($statusQuery);
    $stmt->execute(array($startDate, $endDate));
    $reports['bookingsByStatus'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 3. Room Performance
    $roomQuery = "SELECT 
        r.id,
        r.name,
        r.type,
        r.price,
        COUNT(b.id) as total_bookings,
        SUM(b.total_price) as total_revenue,
        SUM(DATEDIFF(b.check_out, b.check_in)) as total_nights_booked
    FROM rooms r
    LEFT JOIN bookings b ON r.id = b.room_id AND b.created_at BETWEEN ? AND ?
    GROUP BY r.id, r.name, r.type, r.price
    ORDER BY total_revenue DESC";
    
    $stmt = $db->prepare($roomQuery);
    $stmt->execute(array($startDate, $endDate));
    $reports['roomPerformance'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 4. Daily Revenue Trend (last 30 days)
    $trendQuery = "SELECT 
        DATE(created_at) as date,
        COUNT(*) as bookings,
        SUM(total_price) as revenue
    FROM bookings 
    WHERE created_at BETWEEN ? AND ?
    GROUP BY DATE(created_at)
    ORDER BY date ASC";
    
    $stmt = $db->prepare($trendQuery);
    $stmt->execute(array($startDate, $endDate));
    $reports['dailyTrend'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 5. Room Type Performance
    $roomTypeQuery = "SELECT 
        r.type,
        COUNT(b.id) as bookings,
        SUM(b.total_price) as revenue
    FROM rooms r
    LEFT JOIN bookings b ON r.id = b.room_id AND b.created_at BETWEEN ? AND ?
    GROUP BY r.type
    ORDER BY revenue DESC";
    
    $stmt = $db->prepare($roomTypeQuery);
    $stmt->execute(array($startDate, $endDate));
    $reports['roomTypePerformance'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 6. Top Customers
    $customersQuery = "SELECT 
        u.id,
        u.name,
        u.email,
        COUNT(b.id) as total_bookings,
        SUM(b.total_price) as total_spent
    FROM users u
    INNER JOIN bookings b ON u.id = b.user_id
    WHERE b.created_at BETWEEN ? AND ?
    GROUP BY u.id, u.name, u.email
    ORDER BY total_spent DESC
    LIMIT 10";
    
    $stmt = $db->prepare($customersQuery);
    $stmt->execute(array($startDate, $endDate));
    $reports['topCustomers'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 7. Occupancy Rate
    $occupancyQuery = "SELECT 
        COUNT(DISTINCT r.id) as total_rooms,
        COUNT(DISTINCT CASE WHEN r.status = 'occupied' THEN r.id END) as occupied_rooms,
        COUNT(DISTINCT CASE WHEN r.status = 'available' THEN r.id END) as available_rooms,
        COUNT(DISTINCT CASE WHEN r.status = 'maintenance' THEN r.id END) as maintenance_rooms
    FROM rooms r";
    
    $stmt = $db->prepare($occupancyQuery);
    $stmt->execute();
    $occupancy = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $occupancy['occupancy_rate'] = $occupancy['total_rooms'] > 0 
        ? round(($occupancy['occupied_rooms'] / $occupancy['total_rooms']) * 100, 2) 
        : 0;
    
    $reports['occupancy'] = $occupancy;

    // 8. Monthly Comparison (current month vs last month)
    $currentMonth = date('Y-m-01');
    $lastMonth = date('Y-m-01', strtotime('-1 month'));
    
    $comparisonQuery = "SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as bookings,
        SUM(total_price) as revenue
    FROM bookings 
    WHERE created_at >= ?
    GROUP BY DATE_FORMAT(created_at, '%Y-%m')
    ORDER BY month DESC
    LIMIT 2";
    
    $stmt = $db->prepare($comparisonQuery);
    $stmt->execute(array($lastMonth));
    $reports['monthlyComparison'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Add date range to response
    $reports['dateRange'] = array(
        'startDate' => $startDate,
        'endDate' => $endDate
    );

    http_response_code(200);
    echo json_encode($reports);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "message" => "Error: " . $e->getMessage()
    ));
}
?>
