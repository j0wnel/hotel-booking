import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bookings: [],
  userBookings: [],
  selectedBooking: null,
  loading: false,
  error: null
};

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    fetchBookingsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchBookingsSuccess: (state, action) => {
      state.loading = false;
      state.bookings = action.payload;
      state.error = null;
    },
    fetchBookingsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchUserBookingsSuccess: (state, action) => {
      state.loading = false;
      state.userBookings = action.payload;
      state.error = null;
    },
    setSelectedBooking: (state, action) => {
      state.selectedBooking = action.payload;
    },
    createBookingSuccess: (state, action) => {
      state.bookings.push(action.payload);
      state.userBookings.push(action.payload);
    },
    updateBookingSuccess: (state, action) => {
      const updatedBooking = action.payload;
      state.bookings = state.bookings.map(booking =>
        booking.id === updatedBooking.id ? updatedBooking : booking
      );
      state.userBookings = state.userBookings.map(booking =>
        booking.id === updatedBooking.id ? updatedBooking : booking
      );
    },
    deleteBookingSuccess: (state, action) => {
      const bookingId = action.payload;
      state.bookings = state.bookings.filter(booking => booking.id !== bookingId);
      state.userBookings = state.userBookings.filter(booking => booking.id !== bookingId);
    }
  }
});

export const {
  fetchBookingsStart,
  fetchBookingsSuccess,
  fetchBookingsFailure,
  fetchUserBookingsSuccess,
  setSelectedBooking,
  createBookingSuccess,
  updateBookingSuccess,
  deleteBookingSuccess
} = bookingsSlice.actions;

export default bookingsSlice.reducer;