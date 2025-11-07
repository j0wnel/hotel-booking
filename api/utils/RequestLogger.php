<?php
class RequestLogger {
    private $logPath;
    private static $instance = null;
    
    private function __construct() {
        $this->logPath = __DIR__ . '/../logs/requests';
        if (!file_exists($this->logPath)) {
            mkdir($this->logPath, 0777, true);
        }
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function logRequest() {
        $timestamp = date('Y-m-d H:i:s');
        $requestData = [
            'timestamp' => $timestamp,
            'ip' => $_SERVER['REMOTE_ADDR'],
            'method' => $_SERVER['REQUEST_METHOD'],
            'uri' => $_SERVER['REQUEST_URI'],
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown',
            'referer' => $_SERVER['HTTP_REFERER'] ?? 'Direct',
            'request_id' => uniqid(),
            'headers' => $this->getRequestHeaders(),
            'query' => $_GET,
            'body' => $this->getRequestBody()
        ];
        
        $logFile = $this->logPath . '/' . date('Y-m-d') . '.log';
        $logEntry = json_encode($requestData) . "\n";
        
        file_put_contents($logFile, $logEntry, FILE_APPEND);
        
        // Set request ID header for tracking
        header('X-Request-ID: ' . $requestData['request_id']);
        
        return $requestData['request_id'];
    }
    
    private function getRequestHeaders() {
        $headers = [];
        foreach ($_SERVER as $key => $value) {
            if (substr($key, 0, 5) === 'HTTP_') {
                $header = str_replace(' ', '-', ucwords(str_replace('_', ' ', strtolower(substr($key, 5)))));
                $headers[$header] = $value;
            }
        }
        return $headers;
    }
    
    private function getRequestBody() {
        $body = file_get_contents('php://input');
        if ($body) {
            $data = json_decode($body, true);
            if ($data) {
                // Sanitize sensitive data
                if (isset($data['password'])) {
                    $data['password'] = '[REDACTED]';
                }
                if (isset($data['credit_card'])) {
                    $data['credit_card'] = '[REDACTED]';
                }
                return $data;
            }
        }
        return $_POST ?: null;
    }
    
    public function logResponse($requestId, $statusCode, $response) {
        $timestamp = date('Y-m-d H:i:s');
        $responseData = [
            'timestamp' => $timestamp,
            'request_id' => $requestId,
            'status_code' => $statusCode,
            'response' => $this->sanitizeResponse($response)
        ];
        
        $logFile = $this->logPath . '/responses_' . date('Y-m-d') . '.log';
        $logEntry = json_encode($responseData) . "\n";
        
        file_put_contents($logFile, $logEntry, FILE_APPEND);
    }
    
    private function sanitizeResponse($response) {
        if (is_string($response)) {
            $data = json_decode($response, true);
            if ($data) {
                // Sanitize sensitive data
                if (isset($data['token'])) {
                    $data['token'] = '[REDACTED]';
                }
                return $data;
            }
            return $response;
        }
        return $response;
    }
}