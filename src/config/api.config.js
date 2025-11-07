const getBaseUrl = () => {
  // Check if we're running on localhost with different port (dev server)
  const isLocalhost = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';
  
  // Get the port being used by the frontend
  const frontendPort = window.location.port;
  
  // If we're on a dev server port (like 5173 for Vite), always use absolute URL to XAMPP
  if (isLocalhost && (frontendPort === '5173' || frontendPort === '3000' || frontendPort === '8080')) {
    return 'http://localhost/hotel-booking/api';
  }
  
  // If we're on localhost but not on a dev port, use absolute URL
  if (isLocalhost && frontendPort !== '80' && frontendPort !== '') {
    return 'http://localhost/hotel-booking/api';
  }
  
  // Otherwise use relative URL
  return '/hotel-booking/api';
};

const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  ENDPOINTS: {
    TEST: '/test.php',
    SERVER_STATUS: '/server-status.php',
    ROOMS: '/controllers/rooms.php',
    BOOKINGS: '/controllers/bookings.php',
    LOGIN: '/controllers/login.php',
    REGISTER: '/controllers/register.php'
  }
};

// Add some helper methods
API_CONFIG.getFullUrl = (endpoint) => {
  return API_CONFIG.BASE_URL + endpoint;
};

export default API_CONFIG;