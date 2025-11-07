const getBaseUrl = () => {
  // Check if we're running on localhost with different port
  const isLocalhost = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';
  
  // Get the port being used by the frontend
  const frontendPort = window.location.port;
  
  // If we're on localhost but not on port 80, use absolute URL
  if (isLocalhost && frontendPort !== '80' && frontendPort !== '') {
    return 'http://localhost/hotel-booking/api';
  }
  
  // Otherwise use relative URL
  return '/hotel-booking/api';
};

const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  ENDPOINTS: {
    TEST: '/test.php', // Test endpoint
    ROOMS: '/controllers/rooms.php',
    BOOKINGS: '/controllers/bookings.php',
    LOGIN: '/controllers/login.php',
    REGISTER: '/controllers/register.php'
  }
};

// Add some helper methods
API_CONFIG.getFullUrl = (endpoint) => {
  const url = new URL(API_CONFIG.BASE_URL + endpoint, window.location.origin);
  return url.toString();
};

API_CONFIG.isServerAccessible = async () => {
  try {
    const response = await fetch(API_CONFIG.getFullUrl(API_CONFIG.ENDPOINTS.TEST));
    const data = await response.json();
    return data.status === 'success';
  } catch (error) {
    console.error('Server accessibility test failed:', error);
    return false;
  }
};

export default API_CONFIG;