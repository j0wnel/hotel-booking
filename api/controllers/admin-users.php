<?php
// CORS headers - MUST be first
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
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

    $method = $_SERVER['REQUEST_METHOD'];

    switch($method) {
        case 'GET':
            // Get all users
            $query = "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC";
            $stmt = $db->prepare($query);
            $stmt->execute();
            
            $users = array();
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $users[] = $row;
            }
            
            http_response_code(200);
            echo json_encode($users);
            break;
        
        case 'PUT':
            // Update user
            $data = json_decode(file_get_contents("php://input"));
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                http_response_code(400);
                echo json_encode(array("message" => "Invalid JSON data."));
                break;
            }
            
            if(isset($_GET['id'])) {
                $id = $_GET['id'];
                
                // Build update query based on what's provided
                $updates = array();
                $params = array();
                
                if(isset($data->name)) {
                    $updates[] = "name = ?";
                    $params[] = $data->name;
                }
                
                if(isset($data->email)) {
                    // Check if email already exists for another user
                    $checkQuery = "SELECT id FROM users WHERE email = ? AND id != ?";
                    $checkStmt = $db->prepare($checkQuery);
                    $checkStmt->execute(array($data->email, $id));
                    
                    if($checkStmt->rowCount() > 0) {
                        http_response_code(400);
                        echo json_encode(array("message" => "Email already exists."));
                        break;
                    }
                    
                    $updates[] = "email = ?";
                    $params[] = $data->email;
                }
                
                if(isset($data->role)) {
                    $updates[] = "role = ?";
                    $params[] = $data->role;
                }
                
                if(isset($data->password) && !empty($data->password)) {
                    $updates[] = "password = ?";
                    $params[] = password_hash($data->password, PASSWORD_BCRYPT);
                }
                
                if(count($updates) > 0) {
                    $params[] = $id;
                    $query = "UPDATE users SET " . implode(", ", $updates) . " WHERE id = ?";
                    $stmt = $db->prepare($query);
                    
                    if($stmt->execute($params)) {
                        http_response_code(200);
                        echo json_encode(array("message" => "User updated successfully."));
                    } else {
                        http_response_code(503);
                        echo json_encode(array("message" => "Unable to update user."));
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(array("message" => "No fields to update."));
                }
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "User ID is required."));
            }
            break;
        
        case 'DELETE':
            if(isset($_GET['id'])) {
                $id = $_GET['id'];
                
                // Prevent deleting own account
                $userData = Auth::requireAdmin();
                if($userData->id == $id) {
                    http_response_code(400);
                    echo json_encode(array("message" => "Cannot delete your own account."));
                    break;
                }
                
                // Check if user has bookings
                $checkQuery = "SELECT COUNT(*) as count FROM bookings WHERE user_id = ?";
                $checkStmt = $db->prepare($checkQuery);
                $checkStmt->execute(array($id));
                $result = $checkStmt->fetch(PDO::FETCH_ASSOC);
                
                if($result['count'] > 0) {
                    http_response_code(400);
                    echo json_encode(array(
                        "message" => "Cannot delete user with existing bookings. Please cancel or complete all bookings first.",
                        "bookings_count" => $result['count']
                    ));
                    break;
                }
                
                $query = "DELETE FROM users WHERE id = ?";
                $stmt = $db->prepare($query);
                
                if($stmt->execute(array($id))) {
                    http_response_code(200);
                    echo json_encode(array("message" => "User deleted successfully."));
                } else {
                    http_response_code(503);
                    echo json_encode(array("message" => "Unable to delete user."));
                }
            } else {
                http_response_code(400);
                echo json_encode(array("message" => "User ID is required."));
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
        "message" => "Error: " . $e->getMessage()
    ));
}
?>
