<?php
class SecurityMiddleware {
    private static $csrfToken = null;
    
    public static function validateInput($data, $rules) {
        $errors = [];
        
        foreach ($rules as $field => $rule) {
            if (!isset($data[$field]) && strpos($rule, 'required') !== false) {
                $errors[$field] = "The {$field} field is required.";
                continue;
            }
            
            if (isset($data[$field])) {
                $value = $data[$field];
                
                if (strpos($rule, 'email') !== false && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
                    $errors[$field] = "The {$field} must be a valid email address.";
                }
                
                if (strpos($rule, 'min:') !== false) {
                    preg_match('/min:(\d+)/', $rule, $matches);
                    $min = (int)$matches[1];
                    if (strlen($value) < $min) {
                        $errors[$field] = "The {$field} must be at least {$min} characters.";
                    }
                }
                
                if (strpos($rule, 'max:') !== false) {
                    preg_match('/max:(\d+)/', $rule, $matches);
                    $max = (int)$matches[1];
                    if (strlen($value) > $max) {
                        $errors[$field] = "The {$field} must not exceed {$max} characters.";
                    }
                }
            }
        }
        
        return $errors;
    }
    
    public static function sanitizeInput($data) {
        if (is_array($data)) {
            return array_map([self::class, 'sanitizeInput'], $data);
        }
        return htmlspecialchars(strip_tags($data));
    }
    
    public static function generateCsrfToken() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        if (!isset($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        
        self::$csrfToken = $_SESSION['csrf_token'];
        return self::$csrfToken;
    }
    
    public static function validateCsrfToken($token) {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        if (!isset($_SESSION['csrf_token']) || $token !== $_SESSION['csrf_token']) {
            return false;
        }
        
        return true;
    }
    
    public static function preventXSS($data) {
        header('X-XSS-Protection: 1; mode=block');
        header('X-Content-Type-Options: nosniff');
        
        return self::sanitizeInput($data);
    }
    
    public static function setSecurityHeaders() {
        header('X-Frame-Options: DENY');
        header('X-Content-Type-Options: nosniff');
        header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
        header('Content-Security-Policy: default-src \'self\'; script-src \'self\' \'unsafe-inline\' \'unsafe-eval\'; style-src \'self\' \'unsafe-inline\';');
        header('Referrer-Policy: strict-origin-when-cross-origin');
    }
}