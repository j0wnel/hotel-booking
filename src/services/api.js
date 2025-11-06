const API_BASE_URL = 'http://localhost/hotel-booking/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

export const apiEndpoints = {
  rooms: `${API_BASE_URL}/controllers/rooms.php`,
  bookings: `${API_BASE_URL}/controllers/bookings.php`,
  users: `${API_BASE_URL}/controllers/users.php`,
  auth: `${API_BASE_URL}/controllers/login.php`,
};

// Auth services
export const login = async (credentials) => {
  try {
    const response = await fetch(apiEndpoints.auth, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  } catch (error) {
    throw error;
  }
};

// Room services
export const fetchRooms = async () => {
  try {
    const response = await fetch(apiEndpoints.rooms);
    return handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const fetchRoomById = async (id) => {
  try {
    const response = await fetch(`${apiEndpoints.rooms}?id=${id}`);
    return handleResponse(response);
  } catch (error) {
    throw error;
  }
};

// Booking services
export const createBooking = async (bookingData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(apiEndpoints.bookings, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    });
    return handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const updateBooking = async (id, bookingData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${apiEndpoints.bookings}?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    });
    return handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const deleteBooking = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${apiEndpoints.bookings}?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  } catch (error) {
    throw error;
  }
};