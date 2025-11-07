<?php
class ErrorHandler {
    public static function handleError($errno, $errstr, $errfile, $errline) {
        $error = [
            'type' => $errno,
            'message' => $errstr,
            'file' => $errfile,
            'line' => $errline
        ];
        
        self::logError($error);
        
        // Return JSON response for API requests
        if (strpos($_SERVER['REQUEST_URI'], '/api/') !== false) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode([
                'status' => 'error',
                'message' => 'An internal server error occurred',
                'code' => 500
            ]);
            exit;
        }
    }
    
    public static function handleException($exception) {
        $error = [
            'type' => get_class($exception),
            'message' => $exception->getMessage(),
            'file' => $exception->getFile(),
            'line' => $exception->getLine()
        ];
        
        self::logError($error);
        
        // Return JSON response for API requests
        header('Content-Type: application/json');
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'An internal server error occurred',
            'code' => 500
        ]);
    }
    
    private static function logError($error) {
        $logPath = __DIR__ . '/../logs';
        if (!file_exists($logPath)) {
            mkdir($logPath, 0777, true);
        }
        
        $logFile = $logPath . '/error.log';
        $timestamp = date('Y-m-d H:i:s');
        $errorData = sprintf(
            "[%s] Type: %s | Message: %s | File: %s | Line: %s\n",
            $timestamp,
            $error['type'],
            $error['message'],
            $error['file'],
            $error['line']
        );
        
        error_log($errorData, 3, $logFile);
    }
}