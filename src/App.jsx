import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/common/Navigation';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RoomDetailsPage from './pages/booking/RoomDetailsPage';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Navigation />
            <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/room/:id" element={<RoomDetailsPage />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;
