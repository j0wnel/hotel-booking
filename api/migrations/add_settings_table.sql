-- Hotel Settings Table Migration
-- Run this to add settings functionality

CREATE TABLE IF NOT EXISTS hotel_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type ENUM('text', 'number', 'boolean', 'email', 'time') DEFAULT 'text',
    label VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO hotel_settings (category, setting_key, setting_value, setting_type, label, description) VALUES
-- General Settings
('general', 'hotel_name', 'Luxury Hotel & Resort', 'text', 'Hotel Name', 'The name of your hotel'),
('general', 'hotel_email', 'info@luxuryhotel.com', 'email', 'Hotel Email', 'Primary contact email address'),
('general', 'hotel_phone', '+63 123 456 7890', 'text', 'Hotel Phone', 'Primary contact phone number'),
('general', 'hotel_address', '123 Beach Road, Manila, Philippines', 'text', 'Hotel Address', 'Physical address of the hotel'),
('general', 'currency_symbol', '₱', 'text', 'Currency Symbol', 'Currency symbol to display'),

-- Booking Settings
('booking', 'min_booking_days', '1', 'number', 'Minimum Booking Days', 'Minimum number of days for a booking'),
('booking', 'max_booking_days', '30', 'number', 'Maximum Booking Days', 'Maximum number of days for a booking'),
('booking', 'advance_booking_days', '365', 'number', 'Advance Booking Period', 'How many days in advance guests can book'),
('booking', 'cancellation_hours', '24', 'number', 'Cancellation Period (Hours)', 'Hours before check-in to allow cancellation'),
('booking', 'auto_confirm_bookings', 'false', 'boolean', 'Auto-Confirm Bookings', 'Automatically confirm new bookings'),

-- Check-in/Check-out Times
('checkin', 'checkin_time', '14:00', 'time', 'Check-in Time', 'Default check-in time'),
('checkin', 'checkout_time', '12:00', 'time', 'Check-out Time', 'Default check-out time'),
('checkin', 'early_checkin_enabled', 'true', 'boolean', 'Enable Early Check-in', 'Allow guests to request early check-in'),
('checkin', 'late_checkout_enabled', 'true', 'boolean', 'Enable Late Check-out', 'Allow guests to request late check-out'),

-- Pricing Settings
('pricing', 'tax_rate', '12', 'number', 'Tax Rate (%)', 'Tax percentage to apply to bookings'),
('pricing', 'service_charge', '10', 'number', 'Service Charge (%)', 'Service charge percentage'),
('pricing', 'weekend_surcharge', '15', 'number', 'Weekend Surcharge (%)', 'Additional charge for weekend bookings'),
('pricing', 'holiday_surcharge', '25', 'number', 'Holiday Surcharge (%)', 'Additional charge for holiday bookings'),

-- Notification Settings
('notifications', 'email_notifications', 'true', 'boolean', 'Email Notifications', 'Send email notifications to guests'),
('notifications', 'admin_notifications', 'true', 'boolean', 'Admin Notifications', 'Send notifications to admin for new bookings'),
('notifications', 'reminder_emails', 'true', 'boolean', 'Reminder Emails', 'Send reminder emails before check-in'),
('notifications', 'reminder_days', '1', 'number', 'Reminder Days Before', 'Days before check-in to send reminder'),

-- System Settings
('system', 'maintenance_mode', 'false', 'boolean', 'Maintenance Mode', 'Enable maintenance mode (disable new bookings)'),
('system', 'max_rooms_per_booking', '3', 'number', 'Max Rooms Per Booking', 'Maximum rooms a user can book at once'),
('system', 'require_payment', 'false', 'boolean', 'Require Payment', 'Require payment at time of booking'),
('system', 'guest_reviews_enabled', 'true', 'boolean', 'Enable Guest Reviews', 'Allow guests to leave reviews');
