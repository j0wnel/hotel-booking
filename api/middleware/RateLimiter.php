<?php
class RateLimiter {
    private $redis;
    private $maxAttempts = 60;  // Maximum attempts per window
    private $decayMinutes = 1;  // Time window in minutes
    
    public function __construct() {
        $this->redis = new Redis();
        try {
            $this->redis->connect('127.0.0.1', 6379);
        } catch (Exception $e) {
            // Fallback to file-based storage if Redis is not available
            $this->redis = null;
        }
    }
    
    public function attempt($key, $maxAttempts = null, $decayMinutes = null) {
        $maxAttempts = $maxAttempts ?: $this->maxAttempts;
        $decayMinutes = $decayMinutes ?: $this->decayMinutes;
        
        $key = $this->getKey($key);
        
        if ($this->redis) {
            return $this->attemptRedis($key, $maxAttempts, $decayMinutes);
        }
        
        return $this->attemptFile($key, $maxAttempts, $decayMinutes);
    }
    
    private function attemptRedis($key, $maxAttempts, $decayMinutes) {
        $this->redis->multi();
        $this->redis->incr($key);
        $this->redis->expire($key, $decayMinutes * 60);
        $result = $this->redis->exec();
        
        $attempts = $result[0];
        
        if ($attempts > $maxAttempts) {
            return false;
        }
        
        return true;
    }
    
    private function attemptFile($key, $maxAttempts, $decayMinutes) {
        $file = sys_get_temp_dir() . '/rate_limit_' . sha1($key) . '.tmp';
        
        if (!file_exists($file)) {
            file_put_contents($file, json_encode([
                'attempts' => 0,
                'reset_at' => time() + ($decayMinutes * 60)
            ]));
        }
        
        $content = json_decode(file_get_contents($file), true);
        
        if (time() >= $content['reset_at']) {
            $content = [
                'attempts' => 0,
                'reset_at' => time() + ($decayMinutes * 60)
            ];
        }
        
        $content['attempts']++;
        
        file_put_contents($file, json_encode($content));
        
        return $content['attempts'] <= $maxAttempts;
    }
    
    private function getKey($key) {
        return sprintf(
            'rate_limit:%s:%s',
            $key,
            floor(time() / ($this->decayMinutes * 60))
        );
    }
    
    public function remaining($key) {
        $key = $this->getKey($key);
        
        if ($this->redis) {
            $attempts = $this->redis->get($key) ?: 0;
        } else {
            $file = sys_get_temp_dir() . '/rate_limit_' . sha1($key) . '.tmp';
            if (!file_exists($file)) {
                return $this->maxAttempts;
            }
            $content = json_decode(file_get_contents($file), true);
            $attempts = $content['attempts'];
        }
        
        return $this->maxAttempts - $attempts;
    }
}