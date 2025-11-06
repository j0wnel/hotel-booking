import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  rooms: [],
  selectedRoom: null,
  loading: false,
  error: null,
  filters: {
    priceRange: [0, 1000],
    type: 'all',
    capacity: 'all'
  }
};

const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    fetchRoomsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchRoomsSuccess: (state, action) => {
      state.loading = false;
      state.rooms = action.payload;
      state.error = null;
    },
    fetchRoomsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedRoom: (state, action) => {
      state.selectedRoom = action.payload;
    },
    updateFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload
      };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    }
  }
});

export const {
  fetchRoomsStart,
  fetchRoomsSuccess,
  fetchRoomsFailure,
  setSelectedRoom,
  updateFilters,
  clearFilters
} = roomsSlice.actions;

export default roomsSlice.reducer;