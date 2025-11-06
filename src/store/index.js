import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import roomsReducer from './roomsSlice';
import bookingsReducer from './bookingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    rooms: roomsReducer,
    bookings: bookingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;