# Hotel Booking System

A modern, full-featured web-based hotel booking system built with React and PHP. Features a responsive design, real-time availability checking, and comprehensive admin panel for managing rooms, bookings, and users.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![PHP](https://img.shields.io/badge/PHP-7.4+-purple.svg)](https://www.php.net/)

---

## 📚 Documentation

- **[Quick Start Guide](./QUICK_START.md)** - Get started in 5 minutes
- **[Implementation Summary](./IMPLEMENTATION_SUMMARY.md)** - Complete feature overview
- **[Implementation Checklist](./IMPLEMENTATION_CHECKLIST_COMPLETED.md)** - Development progress
- **[Image Upload Guide](./IMAGE_UPLOAD_GUIDE.md)** - Upload system documentation
- **[Changelog](./CHANGELOG.md)** - Version history and updates

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Key Features Explained](#-key-features-explained)
- [Testing](#-testing)
- [Troubleshooting](#-troubleshooting)
- [Development Scripts](#-development-scripts)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [Roadmap](#️-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Features

### For Guests ✅
- **Browse Rooms**: View available rooms with search and advanced filtering (price range, room type, capacity)
- **Room Details**: Detailed room information with images, amenities, and pricing
- **Real-time Availability**: Check room availability for specific dates before booking
- **Secure Booking**: Complete booking process with date validation and price calculation
- **User Registration**: Create account with email validation
- **Account Management**: Login/logout functionality with secure authentication
- **Booking History**: View all bookings with status tracking (pending, confirmed, cancelled)
- **Cancel Bookings**: Cancel pending bookings directly from the dashboard

### For Administrators ✅
- **Dashboard Analytics**: Real-time statistics including total bookings, revenue, occupancy rate
- **Room Management**: Full CRUD operations (Create, Read, Update, Delete) for rooms
- **Image Upload**: Direct image upload for room photos with preview
- **Booking Management**: View all bookings with user and room details
- **Status Updates**: Change booking status (pending, confirmed, cancelled)
- **User Management**: View and manage user accounts
- **Search & Filter**: Advanced search and filtering across bookings and rooms
- **Pagination**: Efficient data handling with paginated views

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library with hooks
- **Redux Toolkit** - State management
- **React Router v7** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server

### Backend
- **PHP 7.4+** - Server-side logic
- **MySQL** - Relational database
- **RESTful API** - Clean API architecture

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 📦 Project Structure

```
hotel-booking/
├── api/                       # PHP Backend
│   ├── config/               # Database configuration
│   │   ├── database.php      # MySQL connection
│   │   └── database.docker.php
│   ├── controllers/          # API endpoints
│   │   ├── admin.php         # Admin statistics & management
│   │   ├── admin-bookings.php
│   │   ├── admin-reports.php
│   │   ├── admin-settings.php
│   │   ├── admin-stats.php
│   │   ├── admin-users.php
│   │   ├── bookings.php      # Booking operations
│   │   ├── login.php         # User authentication
│   │   ├── register.php      # User registration
│   │   ├── rooms.php         # Room management
│   │   └── upload.php        # Image upload
│   ├── middleware/           # Authentication & security
│   │   ├── auth.php
│   │   ├── RateLimiter.php
│   │   └── SecurityMiddleware.php
│   ├── models/              # Database models
│   │   ├── booking.php
│   │   ├── room.php
│   │   └── user.php
│   ├── utils/               # Utility classes
│   │   ├── ApiResponse.php
│   │   ├── ErrorHandler.php
│   │   └── RequestLogger.php
│   ├── uploads/             # Uploaded files
│   │   └── rooms/           # Room images
│   └── database.sql         # Database schema
├── src/                     # React Frontend
│   ├── components/          # Reusable UI components
│   │   ├── common/
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── AdminSidebar.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── Navigation.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   └── LandingPage.jsx
│   ├── pages/              # Page components
│   │   ├── HomePage.jsx
│   │   ├── admin/          # Admin pages
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminRoomsPage.jsx
│   │   │   ├── AdminBookingsPage.jsx
│   │   │   ├── AdminUsersPage.jsx
│   │   │   ├── AdminReportsPage.jsx
│   │   │   └── AdminSettingsPage.jsx
│   │   ├── auth/           # Authentication pages
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   └── booking/        # Booking pages
│   │       ├── RoomsPage.jsx
│   │       ├── RoomDetailsPage.jsx
│   │       └── MyBookingsPage.jsx
│   ├── context/            # React context
│   │   └── AuthContext.jsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useApi.js
│   │   ├── useBookingAvailability.js
│   │   ├── useDebounce.js
│   │   ├── useFilters.js
│   │   ├── useForm.js
│   │   ├── useIntersectionObserver.js
│   │   ├── useLocalStorage.js
│   │   ├── useMediaQuery.js
│   │   ├── usePagination.js
│   │   └── useSearch.js
│   ├── services/           # API services
│   │   └── api.js
│   ├── store/              # Redux store
│   │   ├── index.js
│   │   ├── actions.js
│   │   ├── authSlice.js
│   │   ├── bookingsSlice.js
│   │   └── roomsSlice.js
│   └── utils/              # Utility functions
│       ├── auth.js
│       ├── bookingUtils.js
│       └── validation.js
└── public/                 # Static assets
```
 
## 🚀 Getting Started

### Prerequisites
- **Node.js** v16 or higher
- **PHP** 7.4 or higher
- **MySQL** 5.7 or higher
- **XAMPP/WAMP/MAMP** (or any Apache/PHP/MySQL stack)

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/j0wnel/hotel-booking.git
cd hotel-booking
```

2. **Install frontend dependencies**:
```bash
npm install
```

3. **Configure the database**:
   - Start MySQL server (via XAMPP/WAMP/MAMP)
   - Create a database named `hotel_booking`
   - Import the schema: `api/database.sql`
   - Update credentials in `api/config/database.php`:
     ```php
     private $host = "localhost";
     private $db_name = "hotel_booking";
     private $username = "root";
     private $password = "";
     ```

4. **Set up environment variables**:
   - Create `.env` file in root directory:
     ```env
     VITE_API_URL=http://localhost/hotel-booking/api
     ```

5. **Start the development servers**:
   ```bash
   # Start frontend (Vite dev server)
   npm run dev
   
   # Start backend (Apache via XAMPP/WAMP/MAMP)
   # Make sure Apache is running and PHP is configured
   ```

6. **Access the application**:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost/hotel-booking/api`

### Default Admin Credentials
After importing the database:
- **Email**: `admin@example.com`
- **Password**: `admin123`

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/controllers/login.php` - User login
- `POST /api/controllers/register.php` - User registration

### Room Endpoints
- `GET /api/controllers/rooms.php` - Get all rooms
- `GET /api/controllers/rooms.php?id={id}` - Get room by ID
- `POST /api/controllers/rooms.php` - Create room (Admin only)
- `PUT /api/controllers/rooms.php?id={id}` - Update room (Admin only)
- `DELETE /api/controllers/rooms.php?id={id}` - Delete room (Admin only)

### Booking Endpoints
- `GET /api/controllers/bookings.php` - Get all bookings
- `GET /api/controllers/bookings.php?user_id={id}` - Get user bookings
- `POST /api/controllers/bookings.php` - Create booking
- `PUT /api/controllers/bookings.php?id={id}` - Update booking status
- `DELETE /api/controllers/bookings.php?id={id}` - Cancel booking

### Admin Endpoints
- `GET /api/controllers/admin.php/stats` - Dashboard statistics
- `GET /api/controllers/admin-bookings.php` - All bookings with details
- `PUT /api/controllers/admin-bookings.php/{id}` - Update booking status
- `GET /api/controllers/admin-users.php` - All users
- `POST /api/controllers/upload.php` - Upload room image (Admin only)

### Response Format
All API responses follow this structure:
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Success message"
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message",
  "code": 400
}
```

## 🎯 Key Features Explained

### Room Availability System
- Real-time checking prevents double bookings
- Date validation ensures logical booking periods
- Automatic price calculation based on duration

### Image Upload System
- Supports JPG, PNG, GIF, WebP formats
- Maximum file size: 5MB
- Automatic filename generation
- Admin-only access with authentication

### Booking Management
- Three status levels: Pending, Confirmed, Cancelled
- Users can cancel pending bookings
- Admins can update any booking status
- Complete booking history tracking

### Security Features
- Password hashing with PHP's password_hash()
- SQL injection prevention with prepared statements
- Authentication middleware for protected routes
- Role-based access control (User/Admin)

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration with validation
- [ ] User login/logout
- [ ] Browse rooms with filters
- [ ] View room details
- [ ] Create booking with date validation
- [ ] View booking history
- [ ] Cancel pending bookings
- [ ] Admin dashboard statistics
- [ ] Admin room management (CRUD)
- [ ] Admin booking status updates
- [ ] Image upload functionality

### Test Files
- `api/test.php` - PHP configuration test
- `api/test-upload.html` - Image upload test
- `api/test-fetch.html` - API fetch test
- `api/server-status.php` - Server status check

## 🔧 Troubleshooting

### Common Issues

**Issue**: Frontend can't connect to API
- **Solution**: Check `VITE_API_URL` in `.env` file
- Verify Apache is running
- Check PHP error logs in XAMPP

**Issue**: Database connection failed
- **Solution**: Verify MySQL is running
- Check credentials in `api/config/database.php`
- Ensure database `hotel_booking` exists

**Issue**: Images not uploading
- **Solution**: Check folder permissions on `api/uploads/rooms/`
- Verify you're logged in as admin
- Check file size (max 5MB) and format (JPG, PNG, GIF, WebP)

**Issue**: 404 errors on API endpoints
- **Solution**: Ensure `.htaccess` is present and mod_rewrite is enabled
- Check Apache configuration
- Verify file paths in API calls

## 💻 Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📁 Database Schema

### Tables

**users**
- id (Primary Key)
- name
- email (Unique)
- password (Hashed)
- role (user/admin)
- created_at

**rooms**
- id (Primary Key)
- name
- type
- price
- capacity
- description
- image_url
- created_at

**bookings**
- id (Primary Key)
- user_id (Foreign Key → users.id)
- room_id (Foreign Key → rooms.id)
- check_in_date
- check_out_date
- total_price
- status (pending/confirmed/cancelled)
- created_at

## � Deployment

### Production Checklist
1. Update `VITE_API_URL` for production domain
2. Build frontend: `npm run build`
3. Configure PHP production settings (disable error display)
4. Set up MySQL with production credentials
5. Enable HTTPS/SSL
6. Configure proper file permissions
7. Set up automated backups

## 🛣️ Roadmap

### Planned Features
- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Email notifications for bookings
- [ ] Multi-language support
- [ ] Advanced search with amenities filter
- [ ] Room reviews and ratings
- [ ] Calendar view for availability
- [ ] PDF invoice generation
- [ ] Mobile app version
- [ ] Dark mode support
- [ ] Analytics dashboard

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## �📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**j0wnel**
- GitHub: [@j0wnel](https://github.com/j0wnel)
- Repository: [hotel-booking](https://github.com/j0wnel/hotel-booking)

## ✨ Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Vite team for the blazing fast build tool
- Redux Toolkit for simplified state management
- PHP community for excellent documentation

## 📞 Support

For support, please open an issue on GitHub or contact through the repository.

---

**Built with ❤️ using React and PHP**
