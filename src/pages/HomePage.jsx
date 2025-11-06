import React from 'react';
import useSearch from '../hooks/useSearch';
import useFilters from '../hooks/useFilters';
import usePagination from '../hooks/usePagination';
import useApi from '../hooks/useApi';

const initialFilters = {
  priceRange: [0, 1000],
  roomType: 'all',
  capacity: 'all',
};

const HomePage = () => {
  const { loading, error, fetchData } = useApi();
  const [rooms, setRooms] = React.useState([]);
  const { filters, updateFilter, applyFilters } = useFilters(initialFilters);
  const { searchTerm, setSearchTerm, searchResults } = useSearch(rooms, ['name', 'description']);
  const { paginatedData, currentPage, totalPages, nextPage, prevPage } = usePagination(searchResults);

  React.useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await fetchData('controllers/rooms.php');
        if (Array.isArray(data)) {
          setRooms(data);
        }
      } catch (err) {
        console.error('Error fetching rooms:', err);
      }
    };

    fetchRooms();
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center text-center">
          <div className="text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Find Your Perfect Stay
            </h1>
            <p className="text-xl mb-8">
              Discover luxury accommodations for your next journey
            </p>
            {/* Search Bar */}
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg shadow-lg">
                <input
                  type="text"
                  placeholder="Search for rooms..."
                  className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn-primary">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Results */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Filters</h3>
              {/* Price Range Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Price Range</label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={filters.priceRange[1]}
                  onChange={(e) => updateFilter('priceRange', [0, parseInt(e.target.value)])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>$0</span>
                  <span>${filters.priceRange[1]}</span>
                </div>
              </div>

              {/* Room Type Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Room Type</label>
                <select
                  value={filters.roomType}
                  onChange={(e) => updateFilter('roomType', e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="all">All Types</option>
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="suite">Suite</option>
                </select>
              </div>

              {/* Capacity Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Capacity</label>
                <select
                  value={filters.capacity}
                  onChange={(e) => updateFilter('capacity', e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="all">Any</option>
                  <option value="1">1 Person</option>
                  <option value="2">2 People</option>
                  <option value="4">4 People</option>
                  <option value="6">6+ People</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="md:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center">{error}</div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedData.map((room) => (
                    <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <img
                        src={room.image}
                        alt={room.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2">{room.name}</h3>
                        <p className="text-gray-600 mb-4">{room.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-primary font-bold">${room.price}/night</span>
                          <button className="btn-primary">Book Now</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center gap-2">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border rounded-md disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2">
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
      </section>
    </div>
  );
};

export default HomePage;