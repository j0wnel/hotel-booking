import { useState, useEffect, useCallback } from 'react';
import { validateBookingDates } from '../utils/bookingUtils';

const useBookingAvailability = (roomId, checkIn, checkOut) => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkAvailability = useCallback(async () => {
    if (!roomId || !checkIn || !checkOut) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Fetch existing bookings for the room
      const response = await fetch(`/api/rooms/${roomId}/bookings`);
      const existingBookings = await response.json();

      const available = validateBookingDates(checkIn, checkOut, existingBookings);
      setIsAvailable(available);
    } catch (err) {
      setError(err.message);
      setIsAvailable(false);
    } finally {
      setLoading(false);
    }
  }, [roomId, checkIn, checkOut]);

  useEffect(() => {
    checkAvailability();
  }, [checkAvailability]);

  return { isAvailable, loading, error, checkAvailability };
};

export default useBookingAvailability;