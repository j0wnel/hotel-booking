<?php
require_once "config/database.php";

// Admin credentials
$name = "Admin";
$email = "admin@hotel.com";
$password = "admin123"; // Change this to a secure password
$role = "admin";

try {
    $database = new Database();
    $db = $database->getConnection();
    
    if ($db === null) {
        die("Database connection failed!\n");
    }
    
    // Check if admin already exists
    $checkQuery = "SELECT id FROM users WHERE email = :email";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':email', $email);
    $checkStmt->execute();
    
    if ($checkStmt->rowCount() > 0) {
        echo "Admin user already exists with email: $email\n";
        echo "You can login with:\n";
        echo "Email: $email\n";
        echo "Password: admin123\n";
        exit;
    }
    
    // Hash the password
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    
    // Insert admin user
    $query = "INSERT INTO users (name, email, password, role) VALUES (:name, :email, :password, :role)";
    $stmt = $db->prepare($query);
    
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':password', $hashedPassword);
    $stmt->bindParam(':role', $role);
    
    if ($stmt->execute()) {
        echo "✓ Admin account created successfully!\n\n";
        echo "Login Credentials:\n";
        echo "==================\n";
        echo "Email: $email\n";
        echo "Password: $password\n";
        echo "Role: $role\n";
        echo "\nYou can now login to the admin dashboard.\n";
    } else {
        echo "✗ Failed to create admin account.\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
