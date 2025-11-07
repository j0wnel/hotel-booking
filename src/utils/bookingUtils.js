export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const calculateTotalPrice = (room, checkIn, checkOut) => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  const pricePerNight = parseFloat(room.price || room.pricePerNight || 0);
  return pricePerNight * nights;
};

export const validateBookingDates = (checkIn, checkOut, existingBookings) => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);

  if (start >= end) {
    return false;
  }

  return !existingBookings.some(booking => {
    const bookingStart = new Date(booking.checkIn);
    const bookingEnd = new Date(booking.checkOut);
    return (start < bookingEnd && end > bookingStart);
  });
};

export const generateBookingReference = () => {
  return 'BK-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

export const getDatesBetween = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};