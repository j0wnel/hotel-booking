# Hotel Booking System

A modern web-based hotel booking system built with React and PHP, designed to streamline the hotel room reservation process.

## 🌟 Features

### For Guests
- Browse available rooms with detailed information
- Real-time room availability checking
- Secure booking process
- User account management
- View booking history

### For Administrators
- Comprehensive dashboard for booking management
- Room management system
- Booking statistics and analytics
- User management

## 🛠️ Tech Stack

### Frontend
- React.js
- Redux for state management
- Tailwind CSS for styling
- Vite as build tool

### Backend
- PHP
- MySQL Database
- RESTful API architecture

## 📦 Project Structure

```
hotel-booking/
├── api/                  # PHP Backend
│   ├── config/          # Database configuration
│   ├── controllers/     # API endpoints
│   ├── middleware/      # Authentication middleware
│   └── models/          # Database models
├── src/                 # React Frontend
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── context/        # React context
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API services
│   ├── store/          # Redux store
│   └── utils/          # Utility functions
└── public/             # Static assets
```
 
## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PHP 7.4 or higher
- MySQL
- XAMPP/WAMP/MAMP

### Installation

1. Clone the repository:
```bash
git clone https://github.com/j0wnel/hotel-booking.git
```

2. Install frontend dependencies:
```bash
cd hotel-booking
npm install
```

3. Configure the database:
- Import the database schema from `api/database.sql`
- Update database credentials in `api/config/database.php`

4. Start the development server:
```bash
npm run dev
```

5. Start your PHP server (using XAMPP/WAMP/MAMP)

## 💻 Development

- Frontend runs on: `http://localhost:5173`
- Backend API runs on: `http://localhost/hotel-booking/api`

## 🔒 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost/hotel-booking/api
```

## 📝 API Documentation

The API provides the following endpoints:

- `/api/rooms` - Room management
- `/api/bookings` - Booking operations
- `/api/users` - User management
- `/api/auth` - Authentication

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ✨ Acknowledgments

- React.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Vite team for the build tool
