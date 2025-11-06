import { createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../services/api';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout
} from './authSlice';

export const loginUser = (credentials) => async (dispatch) => {
  try {
    dispatch(loginStart());
    const data = await api.login(credentials);
    localStorage.setItem('token', data.token);
    dispatch(loginSuccess(data));
  } catch (error) {
    dispatch(loginFailure(error.message));
  }
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('token');
  dispatch(logout());
};

export const fetchRooms = createAsyncThunk(
  'rooms/fetchRooms',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.fetchRooms();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBookings = createAsyncThunk(
  'bookings/fetchBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.fetchAllBookings();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await api.createBooking(bookingData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateBooking = createAsyncThunk(
  'bookings/updateBooking',
  async ({ id, bookingData }, { rejectWithValue }) => {
    try {
      const response = await api.updateBooking(id, bookingData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteBooking = createAsyncThunk(
  'bookings/deleteBooking',
  async (id, { rejectWithValue }) => {
    try {
      await api.deleteBooking(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);