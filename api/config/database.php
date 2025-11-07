<?php
require_once __DIR__ . '/../utils/ErrorHandler.php';

class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    public $conn;
    private $maxRetries = 3;
    private $retryDelay = 1; // seconds

    public function __construct() {
        $this->loadEnvironmentVariables();
        $this->host = getenv('DB_HOST') ?: 'localhost';
        $this->db_name = getenv('DB_NAME') ?: 'hotel_booking';
        $this->username = getenv('DB_USER') ?: 'root';
        $this->password = getenv('DB_PASSWORD') ?: '';
    }

    private function loadEnvironmentVariables() {
        $envFile = __DIR__ . '/../../.env';
        if (file_exists($envFile)) {
            $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
                    list($key, $value) = explode('=', $line, 2);
                    putenv(sprintf('%s=%s', trim($key), trim($value)));
                }
            }
        }
    }

    public function __construct() {
        // Use environment variables if available (Docker), otherwise use defaults (local)
        $this->host = getenv('DB_HOST') ?: "localhost";
        $this->db_name = getenv('DB_NAME') ?: "hotel_booking";
        $this->username = getenv('DB_USER') ?: "root";
        $this->password = getenv('DB_PASSWORD') ?: "";
    }

    public function getConnection() {
        $this->conn = null;
        $attempts = 0;

        while ($attempts < $this->maxRetries) {
            try {
                $this->conn = new PDO(
                    "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                    $this->username,
                    $this->password,
                    [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                        PDO::ATTR_TIMEOUT => 5,
                        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
                    ]
                );
                return $this->conn;
            } catch(PDOException $e) {
                $attempts++;
                if ($attempts === $this->maxRetries) {
                    // Log the error using our error handler
                    ErrorHandler::handleException($e);
                    return null;
                }
                sleep($this->retryDelay);
            }
        }

        return $this->conn;
    }
}
?>