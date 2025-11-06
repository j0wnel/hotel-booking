import React from 'react';
import useApi from '../../hooks/useApi';
import usePagination from '../../hooks/usePagination';
import useSearch from '../../hooks/useSearch';

const AdminDashboard = () => {
  const { loading, error, fetchData } = useApi();
  const [bookings, setBookings] = React.useState([]);
  const [stats, setStats] = React.useState({
    totalBookings: 0,
    revenue: 0,
    occupancyRate: 0,
    pendingBookings: 0,
  });

  const { searchTerm, setSearchTerm, searchResults } = useSearch(bookings, [
    'bookingId',
    'guestName',
    'roomNumber',
  ]);

  const {
    paginatedData,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
  } = usePagination(searchResults, 10);

  React.useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await fetchData('/api/controllers/admin.php/bookings');
        if (data && Array.isArray(data)) {
          setBookings(data);
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
      }
    };

    const fetchStats = async () => {
      try {
        const data = await fetchData('/api/controllers/admin.php/stats');
        if (data) {
          setStats(data);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    fetchBookings();
    fetchStats();
  }, [fetchData]);

  const handleStatusChange = async (bookingId, status) => {
    try {
      await fetchData(`/api/controllers/admin.php/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      // Refresh bookings
      const data = await fetchData('/api/controllers/admin.php/bookings');
      if (data && Array.isArray(data)) {
        setBookings(data);
      }
    } catch (err) {
      console.error('Error updating booking status:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Total Bookings</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Revenue</h3>
            <p className="text-3xl font-bold text-gray-900">${stats.revenue}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Occupancy Rate</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.occupancyRate}%</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium">Pending Bookings</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.pendingBookings}</p>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Recent Bookings</h2>
              <input
                type="text"
                placeholder="Search bookings..."
                className="px-4 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center">{error}</div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Booking ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Guest
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Room
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Check-in
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Check-out
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paginatedData.map((booking) => (
                        <tr key={booking.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {booking.bookingId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {booking.guestName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {booking.roomNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(booking.checkIn).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(booking.checkOut).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={booking.status}
                              onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                              className="text-sm rounded-full px-3 py-1"
                              style={{
                                backgroundColor:
                                  booking.status === 'confirmed'
                                    ? '#DEF7EC'
                                    : booking.status === 'pending'
                                    ? '#FEF3C7'
                                    : '#FDE2E2',
                                color:
                                  booking.status === 'confirmed'
                                    ? '#03543F'
                                    : booking.status === 'pending'
                                    ? '#92400E'
                                    : '#9B1C1C',
                              }}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button className="text-primary hover:text-blue-700">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-4 flex justify-between items-center">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border rounded-md disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span>
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border rounded-md disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;