# Hotel Booking System - Implementation Checklist

## 🔧 Configuration & Setup

### Environment Setup
- [ ] Create `.env` file in root directory
  - [ ] Add `VITE_API_URL=http://localhost/hotel-booking/api`
- [ ] Update `api/config/database.php` with your database credentials
  - [ ] Set `$host` (default: "localhost")
  - [ ] Set `$db_name` (default: "hotel_booking")
  - [ ] Set `$username` (default: "root")
  - [ ] Set `$password` (default: "")

### Database Setup
- [ ] Start MySQL server (via XAMPP/WAMP/MAMP)
- [ ] Create database named `hotel_booking`
- [ ] Import `api/database.sql` to create tables:
  - [ ] `users` table
  - [ ] `rooms` table
  - [ ] `bookings` table
- [ ] Verify default admin user exists:
  - Email: admin@example.com
  - Password: admin123

### Server Setup
- [ ] Start PHP server (Apache via XAMPP/WAMP/MAMP)
- [ ] Verify PHP is running on `http://localhost`
- [ ] Install Node.js dependencies: `npm install`
- [ ] Start development server: `npm run dev`
- [ ] Verify frontend is running on `http://localhost:5173`

---

## 🛠️ Core Features to Implement/Fix

### 1. Authentication System

#### AuthContext (`src/context/AuthContext.jsx`)
- [ ] **Fix login API endpoint**
  - Current: `/api/auth/login`
  - Should be: `/api/controllers/login.php`
- [ ] **Implement token persistence**
  - [ ] Save user data to localStorage on login
  - [ ] Restore user from localStorage on app load
  - [ ] Clear localStorage on logout
- [ ] **Add registration function**
  - [ ] Create `register` function in AuthContext
  - [ ] Call `/api/controllers/register.php`
  - [ ] Handle registration success/error

#### ProtectedRoute (`src/components/common/ProtectedRoute.jsx`)
- [ ] **Fix import path**
  - Change from: `import { useAuth } from '@/context/AuthContext';`
  - To: `import { useAuth } from '../../context/AuthContext';`

---

### 2. Booking Utilities & Hooks

#### bookingUtils.js (`src/utils/bookingUtils.js`)
- [ ] **Fix calculateTotalPrice function**
  - Current uses: `room.pricePerNight`
  - Should use: `room.price`
  - Update function to use correct property name

#### useBookingAvailability.js (`src/hooks/useBookingAvailability.js`)
- [ ] **Update API endpoint**
  - Current: `/api/rooms/${roomId}/bookings`
  - Should be: `/api/controllers/bookings.php?room_id=${roomId}&check_in=${checkIn}&check_out=${checkOut}`
- [ ] **Implement proper availability check**
  - [ ] Send dates to backend for validation
  - [ ] Use booking model's `checkAvailability()` method
  - [ ] Return boolean availability status

#### useForm.js (`src/hooks/useForm.js`)
- [ ] **Add handleSubmit function**
  - Currently missing the submit handler
  - Should accept callback function
  - Should handle form submission
  - Should call validation before submit
  ```javascript
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (validate) {
      const validationErrors = validate(values);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setIsSubmitting(false);
        return;
      }
    }
    
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate, onSubmit]);
  ```

---

### 3. API Services

#### api.js (`src/services/api.js`)
- [ ] **Add environment variable for API URL**
  - Replace hardcoded URL with: `import.meta.env.VITE_API_URL`
- [ ] **Add registration endpoint**
  ```javascript
  export const register = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/controllers/register.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  };
  ```
- [ ] **Add check availability endpoint**
  ```javascript
  export const checkRoomAvailability = async (roomId, checkIn, checkOut) => {
    const response = await fetch(
      `${API_BASE_URL}/controllers/bookings.php?room_id=${roomId}&check_in=${checkIn}&check_out=${checkOut}`
    );
    return handleResponse(response);
  };
  ```

---

### 4. Backend Controllers

#### bookings.php (`api/controllers/bookings.php`)
- [ ] **Add availability check endpoint**
  - [ ] Handle GET request with `room_id`, `check_in`, `check_out` parameters
  - [ ] Return JSON: `{ "available": true/false }`
  - [ ] Use booking model's `checkAvailability()` method

#### rooms.php (`api/controllers/rooms.php`)
- [ ] **Add search/filter functionality**
  - [ ] Accept query parameters: `type`, `min_price`, `max_price`, `capacity`
  - [ ] Build dynamic SQL query based on filters
  - [ ] Return filtered results

---

### 5. Missing Features to Implement

#### Room Management (Admin)
- [ ] Create `src/pages/admin/RoomManagement.jsx`
  - [ ] List all rooms with edit/delete buttons
  - [ ] Add room form (name, description, type, capacity, price, image)
  - [ ] Edit room functionality
  - [ ] Delete room functionality
- [ ] Update `api/controllers/rooms.php` to handle:
  - [ ] PUT request for updating rooms
  - [ ] DELETE request for deleting rooms

#### User Profile
- [ ] Create `src/pages/user/ProfilePage.jsx`
  - [ ] Display user information
  - [ ] Edit profile form (name, email)
  - [ ] Change password functionality
- [ ] Create `api/controllers/users.php`
  - [ ] GET user details
  - [ ] PUT update user profile
  - [ ] PUT change password

#### Forgot Password
- [ ] Create `src/pages/auth/ForgotPasswordPage.jsx`
  - [ ] Email input form
  - [ ] Send password reset link
- [ ] Create `src/pages/auth/ResetPasswordPage.jsx`
  - [ ] Token validation
  - [ ] New password form
- [ ] Create `api/controllers/forgot-password.php`
  - [ ] Generate reset token
  - [ ] Send email with reset link
- [ ] Create `api/controllers/reset-password.php`
  - [ ] Validate token
  - [ ] Update password

#### Booking History Export
- [ ] Add export to PDF functionality in `MyBookingsPage.jsx`
- [ ] Add export to CSV functionality in `AdminDashboard.jsx`

#### Email Notifications
- [ ] Set up email service (PHPMailer or similar)
- [ ] Send confirmation email on new booking
- [ ] Send cancellation email
- [ ] Send reminder email 24 hours before check-in

#### Payment Integration
- [ ] Choose payment gateway (Stripe, PayPal, etc.)
- [ ] Create payment controller
- [ ] Add payment form to booking flow
- [ ] Update booking status after successful payment
- [ ] Add payment history to user bookings

---

## 🎨 UI/UX Improvements

### HomePage
- [ ] Add actual hero image background
- [ ] Implement room carousel/featured rooms
- [ ] Add testimonials section
- [ ] Add call-to-action buttons

### RoomDetailsPage
- [ ] Add image gallery/lightbox
- [ ] Add reviews/ratings section
- [ ] Add similar rooms suggestions
- [ ] Add share functionality

### Navigation
- [ ] Add mobile responsive menu (hamburger)
- [ ] Add user dropdown menu (when logged in)
- [ ] Add notification badge for admin

### General
- [ ] Add loading skeletons instead of spinners
- [ ] Add toast notifications for success/error messages
- [ ] Improve form validation with real-time feedback
- [ ] Add dark mode toggle

---

## 🔒 Security Enhancements

### Backend
- [ ] Implement JWT token authentication (replace simple base64)
- [ ] Add CSRF protection
- [ ] Add rate limiting for API endpoints
- [ ] Sanitize all user inputs
- [ ] Add SQL injection protection (using prepared statements - ✅ Already done)
- [ ] Add password strength requirements
- [ ] Implement session timeout

### Frontend
- [ ] Store tokens securely (httpOnly cookies instead of localStorage)
- [ ] Add XSS protection
- [ ] Validate all form inputs client-side
- [ ] Add CAPTCHA to registration/login forms

---

## 📊 Data & Analytics

### Admin Dashboard
- [ ] Add date range filter for statistics
- [ ] Add revenue chart (by month/year)
- [ ] Add booking trends graph
- [ ] Add most popular rooms report
- [ ] Add occupancy rate by room type

### Reports
- [ ] Generate monthly revenue report
- [ ] Generate booking summary report
- [ ] Export reports as PDF/Excel

---

## 🧪 Testing

### Unit Tests
- [ ] Test authentication functions
- [ ] Test booking calculations
- [ ] Test form validations
- [ ] Test API service functions

### Integration Tests
- [ ] Test complete booking flow
- [ ] Test admin booking management
- [ ] Test user registration and login

### End-to-End Tests
- [ ] Test full user journey (search → book → view booking)
- [ ] Test admin workflow

---

## 🚀 Performance Optimization

### Frontend
- [ ] Implement code splitting
- [ ] Add lazy loading for routes
- [ ] Optimize images (use WebP format)
- [ ] Add caching for API responses
- [ ] Implement virtual scrolling for long lists

### Backend
- [ ] Add database indexing
- [ ] Implement query caching
- [ ] Optimize SQL queries
- [ ] Add pagination to all list endpoints

---

## 📱 Responsive Design

- [ ] Test on mobile devices (320px - 480px)
- [ ] Test on tablets (768px - 1024px)
- [ ] Test on desktop (1024px+)
- [ ] Fix any layout issues
- [ ] Add touch-friendly buttons for mobile

---

## 📝 Documentation

- [ ] Add API documentation (endpoints, parameters, responses)
- [ ] Add code comments for complex functions
- [ ] Create user manual
- [ ] Create admin manual
- [ ] Add setup guide for developers

---

## 🐛 Bug Fixes Needed

### High Priority
- [ ] **Fix AuthContext API endpoint** (login function)
- [ ] **Fix ProtectedRoute import path**
- [ ] **Fix calculateTotalPrice** to use `room.price` not `room.pricePerNight`
- [ ] **Fix useBookingAvailability** endpoint
- [ ] **Add handleSubmit to useForm hook**
- [ ] **Update API_BASE_URL** to use environment variable

### Medium Priority
- [ ] Add error boundary component
- [ ] Fix date validation in booking form
- [ ] Add minimum stay requirement (1 night)
- [ ] Prevent booking past dates

### Low Priority
- [ ] Add loading states to all API calls
- [ ] Add retry logic for failed API calls
- [ ] Add offline mode detection

---

## ✅ Deployment Checklist

### Pre-deployment
- [ ] Run all tests
- [ ] Fix all linting errors
- [ ] Optimize production build
- [ ] Remove console.logs
- [ ] Update environment variables for production

### Database
- [ ] Create production database
- [ ] Run migrations
- [ ] Add sample data
- [ ] Set up database backups

### Server
- [ ] Configure production server
- [ ] Set up SSL certificate
- [ ] Configure CORS properly
- [ ] Set up error logging
- [ ] Set up monitoring

### Frontend
- [ ] Build production bundle: `npm run build`
- [ ] Test production build locally
- [ ] Deploy to hosting service
- [ ] Configure CDN for static assets

### Post-deployment
- [ ] Test all features in production
- [ ] Monitor error logs
- [ ] Set up analytics
- [ ] Create backup strategy

---

## 📌 Priority Order

### **CRITICAL (Do First)**
1. Fix AuthContext login endpoint
2. Fix ProtectedRoute import
3. Fix useForm handleSubmit function
4. Fix calculateTotalPrice function
5. Fix useBookingAvailability endpoint
6. Update API services to use environment variables

### **HIGH (Do Next)**
1. Implement room management for admin
2. Add mobile responsive menu
3. Implement email notifications
4. Add proper token-based authentication

### **MEDIUM (Do Later)**
1. Add user profile page
2. Implement forgot password
3. Add payment integration
4. Improve UI/UX with better visuals

### **LOW (Optional Enhancements)**
1. Add dark mode
2. Add analytics dashboard
3. Add export functionality
4. Add advanced search filters

---

## 📖 Notes

- Items marked with ✅ are already implemented
- Items without checkboxes need to be implemented
- Test each feature after implementation
- Keep this checklist updated as you progress
- Prioritize critical bugs before adding new features
