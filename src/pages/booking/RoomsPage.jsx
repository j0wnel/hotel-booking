import React from 'react';
import { Link } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import useDebounce from '../../hooks/useDebounce';
import useFilters from '../../hooks/useFilters';
import usePagination from '../../hooks/usePagination';
import API_CONFIG from '../../config/api.config';

const initialFilters = {
  priceRange: [0, 1000],
  roomType: 'all',
  capacity: 'all',
};

const RoomsPage = () => {
  const { loading, error, fetchData } = useApi();
  const [rooms, setRooms] = React.useState([]);
  const { filters, updateFilter } = useFilters(initialFilters);
  const [searchTerm, setSearchTerm] = React.useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  React.useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetchData(API_CONFIG.ENDPOINTS.ROOMS);
        if (response && Array.isArray(response)) {
          setRooms(response);
        }
      } catch (err) {
        console.error('Error fetching rooms:', err);
        setRooms([]); // Set empty array on error
      }
    };

    fetchRooms();
  }, []);

  // Apply filters
  const filteredRooms = React.useMemo(() => {
    return rooms.filter(room => {
      const term = debouncedSearchTerm.toLowerCase().trim();
      const searchMatch = !term || 
        room.name.toLowerCase().includes(term) ||
        room.description.toLowerCase().includes(term) ||
        room.type.toLowerCase().includes(term);
      
      const priceMatch = room.price >= filters.priceRange[0] && room.price <= filters.priceRange[1];
      const typeMatch = filters.roomType === 'all' || room.type === filters.roomType;
      const capacityMatch = filters.capacity === 'all' || room.capacity >= parseInt(filters.capacity);
      
      return searchMatch && priceMatch && typeMatch && capacityMatch;
    });
  }, [rooms, debouncedSearchTerm, filters]);

  const { paginatedData: displayedRooms, currentPage, totalPages, nextPage, prevPage } = usePagination(filteredRooms, 9);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Our Rooms
          </h1>
          <p className="text-xl text-center max-w-2xl mx-auto">
            Explore our selection of comfortable and luxurious accommodations
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="container mx-auto px-4 py-8">
        <div className="mb-6 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for rooms..."
              className="w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search rooms"
            />
            <svg
              className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          {loading ? (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            </div>
          ) : null}
          {filteredRooms.length === 0 && searchTerm && (
            <p className="text-gray-500 mt-2">No rooms found matching your search criteria.</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow sticky top-4">
              <h3 className="text-lg font-semibold mb-4">Filters</h3>
              
              {/* Price Range Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Price Range</label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={filters.priceRange[1]}
                  onChange={(e) => updateFilter('priceRange', [0, parseInt(e.target.value)])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>$0</span>
                  <span>${filters.priceRange[1]}</span>
                </div>
              </div>

              {/* Room Type Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Room Type</label>
                <select
                  value={filters.roomType}
                  onChange={(e) => updateFilter('roomType', e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Types</option>
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="suite">Suite</option>
                </select>
              </div>

              {/* Capacity Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Minimum Capacity</label>
                <select
                  value={filters.capacity}
                  onChange={(e) => updateFilter('capacity', e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">Any</option>
                  <option value="1">1 Person</option>
                  <option value="2">2 People</option>
                  <option value="4">4 People</option>
                  <option value="6">6+ People</option>
                </select>
              </div>

              <button
                onClick={() => {
                  updateFilter('priceRange', [0, 1000]);
                  updateFilter('roomType', 'all');
                  updateFilter('capacity', 'all');
                }}
                className="w-full text-sm text-primary hover:underline"
              >
                Reset Filters
              </button>
            </div>
          </div>

          {/* Results Grid */}
          <div className="md:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center p-8 bg-red-50 rounded-lg">
                {error}
              </div>
            ) : displayedRooms.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">No rooms found matching your criteria.</p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-gray-600">
                  Showing {displayedRooms.length} of {filteredRooms.length} rooms
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedRooms.map((room) => (
                    <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      <div className="relative h-48 bg-gray-200">
                        {room.image ? (
                          <img
                            src={room.image}
                            alt={room.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <svg
                              className="w-16 h-16 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                        <span className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-semibold text-gray-700 capitalize">
                          {room.type}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2 text-gray-900">{room.name}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {room.description || 'Comfortable room with modern amenities'}
                        </p>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center text-gray-600 text-sm">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            <span>{room.capacity} guests</span>
                          </div>
                          <span className="text-primary font-bold text-xl">
                            ${room.price}
                            <span className="text-sm text-gray-500">/night</span>
                          </span>
                        </div>
                        <Link
                          to={`/room/${room.id}`}
                          className="block w-full text-center bg-primary text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="mt-8 flex justify-center gap-2">
                    <button
                      onClick={prev}
                      disabled={page === 1}
                      className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 flex items-center">
                      Page {page} of {pages}
                    </span>
                    <button
                      onClick={next}
                      disabled={page === pages}
                      className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default RoomsPage;
