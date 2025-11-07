import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/common/Navigation';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import RoomsPage from './pages/booking/RoomsPage';
import RoomDetailsPage from './pages/booking/RoomDetailsPage';
import MyBookingsPage from './pages/booking/MyBookingsPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRoomsPage from './pages/admin/AdminRoomsPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-gray-100">
      {!isAdminRoute && <Navigation />}
      <div className={!isAdminRoute ? "container mx-auto px-4 py-8" : ""}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/room/:id" element={<RoomDetailsPage />} />
              <Route
                path="/my-bookings"
                element={
                  <ProtectedRoute>
                    <MyBookingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/rooms"
                element={
                  <ProtectedRoute>
                    <AdminRoomsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/bookings"
                element={
                  <ProtectedRoute>
                    <AdminBookingsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute>
                    <AdminUsersPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;
