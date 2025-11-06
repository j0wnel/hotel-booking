<?php
class Auth {
    public static function getAuthorizationHeader(){
        $headers = null;
        if (isset($_SERVER['Authorization'])) {
            $headers = trim($_SERVER["Authorization"]);
        } else if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
        } elseif (function_exists('apache_request_headers')) {
            $requestHeaders = apache_request_headers();
            $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
            if (isset($requestHeaders['Authorization'])) {
                $headers = trim($requestHeaders['Authorization']);
            }
        }
        return $headers;
    }

    public static function getBearerToken() {
        $headers = self::getAuthorizationHeader();
        if (!empty($headers)) {
            if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
                return $matches[1];
            }
        }
        return null;
    }

    public static function validateToken() {
        $token = self::getBearerToken();
        if(!$token) {
            return false;
        }

        try {
            $tokenData = json_decode(base64_decode($token));
            if($tokenData->exp < time()) {
                return false;
            }
            return $tokenData->data;
        } catch(Exception $e) {
            return false;
        }
    }

    public static function requireAuth() {
        $userData = self::validateToken();
        if(!$userData) {
            http_response_code(401);
            echo json_encode(array("message" => "Unauthorized"));
            exit();
        }
        return $userData;
    }

    public static function requireAdmin() {
        $userData = self::requireAuth();
        if($userData->role !== 'admin') {
            http_response_code(403);
            echo json_encode(array("message" => "Forbidden"));
            exit();
        }
        return $userData;
    }
}