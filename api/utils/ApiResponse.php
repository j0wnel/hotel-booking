<?php
class ApiResponse {
    public static function success($data = null, $message = 'Success', $code = 200) {
        header('Content-Type: application/json');
        http_response_code($code);
        echo json_encode([
            'status' => 'success',
            'message' => $message,
            'data' => $data
        ]);
        exit;
    }

    public static function error($message = 'An error occurred', $code = 400, $errors = null) {
        header('Content-Type: application/json');
        http_response_code($code);
        $response = [
            'status' => 'error',
            'message' => $message,
            'code' => $code
        ];
        
        if ($errors !== null) {
            $response['errors'] = $errors;
        }
        
        echo json_encode($response);
        exit;
    }

    public static function unauthorized($message = 'Unauthorized access') {
        self::error($message, 401);
    }

    public static function forbidden($message = 'Access forbidden') {
        self::error($message, 403);
    }

    public static function notFound($message = 'Resource not found') {
        self::error($message, 404);
    }

    public static function validation($errors, $message = 'Validation failed') {
        self::error($message, 422, $errors);
    }
}