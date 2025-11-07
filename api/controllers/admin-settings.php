<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';
require_once '../middleware/auth.php';
require_once '../utils/ApiResponse.php';

// Verify admin authentication
$auth = authMiddleware();
if (!$auth['success']) {
    echo ApiResponse::error($auth['message'], 401);
    exit();
}

if ($auth['user']['role'] !== 'admin') {
    echo ApiResponse::error('Admin access required', 403);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        // Fetch all settings
        $stmt = $pdo->query("SELECT * FROM hotel_settings ORDER BY category, setting_key");
        $settings = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Group settings by category
        $groupedSettings = [];
        foreach ($settings as $setting) {
            $category = $setting['category'];
            if (!isset($groupedSettings[$category])) {
                $groupedSettings[$category] = [];
            }
            $groupedSettings[$category][] = [
                'id' => $setting['id'],
                'key' => $setting['setting_key'],
                'value' => $setting['setting_value'],
                'type' => $setting['setting_type'],
                'label' => $setting['label'],
                'description' => $setting['description']
            ];
        }
        
        echo ApiResponse::success($groupedSettings);
        
    } elseif ($method === 'PUT') {
        // Update settings
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['settings']) || !is_array($data['settings'])) {
            echo ApiResponse::error('Invalid settings data', 400);
            exit();
        }
        
        $pdo->beginTransaction();
        
        try {
            $stmt = $pdo->prepare("
                UPDATE hotel_settings 
                SET setting_value = ?, updated_at = CURRENT_TIMESTAMP 
                WHERE id = ?
            ");
            
            foreach ($data['settings'] as $setting) {
                if (!isset($setting['id']) || !isset($setting['value'])) {
                    continue;
                }
                
                $stmt->execute([
                    $setting['value'],
                    $setting['id']
                ]);
            }
            
            $pdo->commit();
            echo ApiResponse::success(['message' => 'Settings updated successfully']);
            
        } catch (Exception $e) {
            $pdo->rollBack();
            throw $e;
        }
        
    } else {
        echo ApiResponse::error('Method not allowed', 405);
    }
    
} catch (Exception $e) {
    echo ApiResponse::error('Server error: ' . $e->getMessage(), 500);
}
