import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useApi from '../../hooks/useApi';
import useBookingAvailability from '../../hooks/useBookingAvailability';
import { calculateTotalPrice, formatDate } from '../../utils/bookingUtils';

const RoomDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { loading, error, fetchData } = useApi();
  const [room, setRoom] = React.useState(null);
  const [dates, setDates] = React.useState({
    checkIn: '',
    checkOut: '',
  });
  const [bookingError, setBookingError] = React.useState('');
  const [bookingSuccess, setBookingSuccess] = React.useState(false);

  const { isAvailable, loading: checkingAvailability } = useBookingAvailability(
    id,
    dates.checkIn,
    dates.checkOut
  );

  React.useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const data = await fetchData(`/api/controllers/rooms.php?id=${id}`);
        setRoom(data);
      } catch (err) {
        console.error('Error fetching room details:', err);
      }
    };

    fetchRoomDetails();
  }, [fetchData, id]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDates(prev => ({
      ...prev,
      [name]: value
    }));
    setBookingError('');
  };

  const handleBooking = async () => {
    setBookingError('');
    setBookingSuccess(false);

    // Check if user is logged in
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/room/${id}` } });
      return;
    }

    // Validate dates
    if (!dates.checkIn || !dates.checkOut) {
      setBookingError('Please select check-in and check-out dates');
      return;
    }

    const checkInDate = new Date(dates.checkIn);
    const checkOutDate = new Date(dates.checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      setBookingError('Check-in date cannot be in the past');
      return;
    }

    if (checkOutDate <= checkInDate) {
      setBookingError('Check-out date must be after check-in date');
      return;
    }

    if (!isAvailable) {
      setBookingError('Room is not available for selected dates');
      return;
    }

    try {
      const bookingData = {
        user_id: user.id,
        room_id: id,
        check_in: dates.checkIn,
        check_out: dates.checkOut,
        total_price: totalPrice,
        status: 'pending'
      };

      const response = await fetchData('/api/controllers/bookings.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (response.message === 'Booking was created.') {
        setBookingSuccess(true);
        setTimeout(() => {
          navigate('/my-bookings');
        }, 2000);
      } else {
        setBookingError(response.message || 'Failed to create booking');
      }
    } catch (err) {
      setBookingError(err.message || 'Failed to create booking. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-500 text-center">{error}</div>
      </div>
    );
  }

  if (!room) {
    return null;
  }

  const totalPrice = dates.checkIn && dates.checkOut
    ? calculateTotalPrice(room, dates.checkIn, dates.checkOut)
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Room Images */}
        <div className="space-y-4">
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={room.image || room.mainImage || 'https://via.placeholder.com/800x600?text=Room+Image'}
              alt={room.name}
              className="rounded-lg object-cover w-full h-full"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {room.images?.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${room.name} view ${index + 1}`}
                className="rounded-lg object-cover w-full h-24"
              />
            ))}
          </div>
        </div>

        {/* Room Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{room.name}</h1>
            <p className="mt-2 text-gray-600">{room.description || 'Comfortable room with modern amenities'}</p>
          </div>

          <div className="border-t border-b py-4">
            <h2 className="text-xl font-semibold mb-4">Room Details</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium capitalize">{room.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Capacity:</span>
                <span className="font-medium">{room.capacity} guests</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Price per night:</span>
                <span className="text-2xl font-bold text-primary">${room.price}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-b py-4">
            <h2 className="text-xl font-semibold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 gap-4">
              {(room.amenities || ['WiFi', 'Air Conditioning', 'TV', 'Mini Bar']).map((amenity, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <svg
                    className="h-5 w-5 text-green-500"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Book This Room</h2>
            
            {bookingSuccess && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-800">Booking successful! Redirecting to your bookings...</p>
              </div>
            )}

            {bookingError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800">{bookingError}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Check-in
                  </label>
                  <input
                    type="date"
                    name="checkIn"
                    value={dates.checkIn}
                    onChange={handleDateChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Check-out
                  </label>
                  <input
                    type="date"
                    name="checkOut"
                    value={dates.checkOut}
                    onChange={handleDateChange}
                    min={dates.checkIn || new Date().toISOString().split('T')[0]}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>

              {dates.checkIn && dates.checkOut && (
                <div className="bg-white p-4 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Price:</span>
                    <span className="text-2xl font-bold text-primary">
                      ${totalPrice}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    {checkingAvailability ? (
                      <span className="text-gray-500">Checking availability...</span>
                    ) : isAvailable ? (
                      <span className="text-green-500">✓ Room is available for selected dates</span>
                    ) : (
                      <span className="text-red-500">✗ Room is not available for selected dates</span>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={handleBooking}
                disabled={!isAvailable || checkingAvailability || bookingSuccess}
                className="w-full bg-primary text-white py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {checkingAvailability ? 'Checking availability...' : bookingSuccess ? 'Booking Created!' : 'Book Now'}
              </button>
            </div>
          </div>

          {/* Policies */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Policies</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Check-in time: 2:00 PM</p>
              <p>• Check-out time: 11:00 AM</p>
              <p>• No smoking</p>
              <p>• No parties or events</p>
              <p>• Cancellation allowed up to 24 hours before check-in</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsPage;