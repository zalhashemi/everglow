import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';  // Update import name
import BusinessDetailsRegistration from './pages/auth/BusinessDetailsRegistration';

// Customer Pages
import LandingPage from './pages/customer/LandingPage';
import Homepage from './pages/customer/Homepage';
import BusinessPage from './pages/customer/BusinessPage';
import BookingsPage from './pages/customer/BookingsPage';
import CustomerProfile from './pages/customer/Profile';

// Business Pages
import BusinessDashboard from './pages/business/Dashboard';
import BusinessServices from './pages/business/Services';
import BusinessBookings from './pages/business/Bookings';
import BusinessProfile from './pages/business/Profile';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />  // Update route path
          <Route path="/register/business-details" element={<BusinessDetailsRegistration />} />

          {/* Customer Routes */}
          <Route path="/home" element={<Homepage />} />
          <Route path="/business/:id" element={<BusinessPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/profile" element={<CustomerProfile />} />

          {/* Business Routes */}
          <Route path="/business/dashboard" element={<BusinessDashboard />} />
          <Route path="/business/services" element={<BusinessServices />} />
          <Route path="/business/bookings" element={<BusinessBookings />} />
          <Route path="/business/profile" element={<BusinessProfile />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;