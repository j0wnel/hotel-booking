import { useState, useCallback, useEffect } from 'react';
import API_CONFIG from '../config/api.config';

const checkServerStatus = async () => {
  try {
    const url = API_CONFIG.getFullUrl(API_CONFIG.ENDPOINTS.SERVER_STATUS);
    console.log('Checking server status at:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      mode: 'cors',
      cache: 'no-cache'
    });
    
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Server status:', data);
    
    return {
      isAccessible: data.status === 'active',
      details: data
    };
  } catch (error) {
    console.error('Server status check failed:', error);
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
        
        // Don't set error state here - only log to console
        if (!status.isAccessible) {
          console.warn('Server not accessible:', status.error);
        } else {
          console.log('Server is accessible');
          // Clear any previous errors if server becomes accessible
          setError(null);
        }
      } catch (err) {
        console.error('Failed to check server status:', err.message);
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
      
      const url = API_CONFIG.getFullUrl(endpoint);
      console.log('Fetching from:', url);
      
      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...options.headers,
      };
      
      // Add Authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'same-origin',
        mode: 'cors',
      });

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