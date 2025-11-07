import { useState, useCallback, useEffect } from 'react';
import API_CONFIG from '../config/api.config';

const SERVER_STATUS_URL = 'http://localhost/hotel-booking/api/server-status.php';

const checkServerStatus = async () => {
  try {
    const response = await fetch(SERVER_STATUS_URL);
    const data = await response.json();
    return {
      isAccessible: true,
      details: data
    };
  } catch (error) {
    return {
      isAccessible: false,
      error: error.message
    };
  }
};

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serverStatus, setServerStatus] = useState({
    checked: false,
    accessible: false,
    details: null
  });

  // Check server accessibility on mount
  useEffect(() => {
    const checkServer = async () => {
      try {
        const status = await checkServerStatus();
        setServerStatus({
          checked: true,
          accessible: status.isAccessible,
          details: status.details
        });
        
        if (!status.isAccessible) {
          setError(`Server is not accessible. Please check:
            1. Open XAMPP Control Panel
            2. Start Apache (should be green)
            3. Start MySQL (should be green)
            4. Check if another program is using port 80 or 443
            
            Technical details: ${status.error || 'Connection failed'}`);
        }
      } catch (err) {
        setError('Failed to check server status: ' + err.message);
      }
    };
    
    checkServer();
    
    // Set up periodic check every 30 seconds
    const interval = setInterval(checkServer, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = useCallback(async (endpoint, options = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Check server status first
      if (!serverStatus.accessible && serverStatus.checked) {
        const status = await checkServerStatus();
        if (!status.isAccessible) {
          throw new Error(`Server Connection Error:
            
            Please follow these steps:
            1. Open XAMPP Control Panel
            2. If Apache or MySQL is running (red), click Stop
            3. Wait 5 seconds
            4. Click Start for both Apache and MySQL
            5. Wait for both to turn green
            
            If the problem persists:
            - Check if another program is using ports 80/443
            - Try changing Apache port to 8080 in httpd.conf
            - Check XAMPP logs for errors
            
            Technical details: ${status.error || 'Connection failed'}`);
        }
        // Update status if server is now accessible
        setServerStatus({
          checked: true,
          accessible: status.isAccessible,
          details: status.details
        });
      }

      const url = API_CONFIG.getFullUrl(endpoint);
      console.log('Fetching from:', url);
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          ...options.headers,
        },
        credentials: 'same-origin',
        mode: 'cors',
      });

      console.log('Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || `HTTP error! status: ${response.status}`;
        } catch (e) {
          errorMessage = errorText || `HTTP error! status: ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response format: Expected JSON');
      }

      const data = await response.json();
      console.log('Data received:', data);
      return data;
    } catch (err) {
      console.error('API Error:', err);
      const errorMessage = err.message || 'Failed to fetch data';
      setError(errorMessage);
      
      // Handle different types of errors
      if (err.message === 'Failed to fetch') {
        setError(`Server Connection Error:
          
          Quick Fix Steps:
          1. Open XAMPP Control Panel
          2. Click 'Start' for both Apache and MySQL
          3. Wait for both to turn green
          
          If still not working:
          - Check if ports 80 and 443 are free
          - Try restarting XAMPP completely
          - Check Windows Defender or antivirus settings
          
          Need help? Check XAMPP logs in Control Panel.`);
      } else if (err.message.includes('Invalid response format')) {
        setError(`Invalid Server Response:
          
          The server returned an invalid format.
          This usually means:
          - PHP errors are being displayed instead of JSON
          - XAMPP configuration issue
          - Database connection problem
          
          Please check XAMPP logs for details.`);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [serverStatus]);

  return { 
    loading, 
    error, 
    fetchData,
    serverStatus,
    checkServerStatus: checkServerStatus
  };
};

export default useApi;