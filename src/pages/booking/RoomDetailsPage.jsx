import React from 'react';
import { useParams } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import useBookingAvailability from '../../hooks/useBookingAvailability';
import { calculateTotalPrice, formatDate } from '../../utils/bookingUtils';

const RoomDetailsPage = () => {
  const { id } = useParams();
  const { loading, error, fetchData } = useApi();
  const [room, setRoom] = React.useState(null);
  const [dates, setDates] = React.useState({
    checkIn: '',
    checkOut: '',
  });

  const { isAvailable, loading: checkingAvailability } = useBookingAvailability(
    id,
    dates.checkIn,
    dates.checkOut
  );

  React.useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const data = await fetchData(`/api/rooms/${id}`);
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
              src={room.mainImage}
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
            <p className="mt-2 text-gray-600">{room.description}</p>
          </div>

          <div className="border-t border-b py-4">
            <h2 className="text-xl font-semibold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 gap-4">
              {room.amenities?.map((amenity, index) => (
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
                    {isAvailable ? (
                      <span className="text-green-500">Room is available for selected dates</span>
                    ) : (
                      <span className="text-red-500">Room is not available for selected dates</span>
                    )}
                  </div>
                </div>
              )}

              <button
                disabled={!isAvailable || checkingAvailability}
                className="w-full btn-primary disabled:opacity-50"
              >
                {checkingAvailability ? 'Checking availability...' : 'Book Now'}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsPage;