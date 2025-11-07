import { useState, useEffect, useCallback } from 'react';
import { validateBookingDates } from '../utils/bookingUtils';

const useBookingAvailability = (roomId, checkIn, checkOut) => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkAvailability = useCallback(async () => {
    if (!roomId || !checkIn || !checkOut) {
      setIsAvailable(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Validate dates are in correct format and order
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        setIsAvailable(false);
        setError('Invalid date format');
        return;
      }
      
      if (start >= end) {
        setIsAvailable(false);
        setError('Check-out must be after check-in');
        return;
      }
      
      // For now, assume room is available
      // TODO: Implement actual availability check with backend
      setIsAvailable(true);
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