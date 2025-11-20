import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 🔐 Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import BusinessDetailsRegistration from './pages/auth/BusinessDetailsRegistration';

// 👥 Customer Pages
import LandingPage from './pages/customer/LandingPage';
import Homepage from './pages/customer/Homepage';
import BusinessPage from './pages/customer/BusinessPage';
import BookingsPage from './pages/customer/BookingsPage';
import CustomerProfile from './pages/customer/Profile';
import BookingReceiptPage from "./pages/customer/BookingReceiptPage";

// ⭐ Booking Flow
import SelectDatePage from './pages/customer/SelectDatePage';
import BookingSummaryPage from './pages/customer/BookingSummaryPage';
import SearchMapPage from './pages/customer/searchMapPage'; // 🌍 NEW

// 💼 Business Pages
import BusinessDashboard from './pages/business/Dashboard';
import BusinessServices from './pages/business/Services';
import BusinessBookings from './pages/business/Bookings';
import BusinessProfile from './pages/business/Profile';
import LoyaltyPage from './pages/business/LoyaltyPage';

const App: React.FC = () => {
  console.log("🌐 Everglow App Mounted");

  return (
    <Router>
      <Routes>
        {/* ===== PUBLIC & AUTH ROUTES ===== */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/register/business-details" element={<BusinessDetailsRegistration />} />
        <Route path="/business/loyalty" element={<LoyaltyPage />} />

        {/* ===== CUSTOMER ROUTES ===== */}
        <Route path="/home" element={<Homepage />} />
        <Route path="/business/:id" element={<BusinessPage />} />

        {/* ----- Booking Flow ----- */}
        <Route path="/book/select-date" element={<SelectDatePage />} />
        <Route path="/book/summary" element={<BookingSummaryPage />} />
        <Route path="/book/receipt/:id" element={<BookingReceiptPage />} />

        {/* Customer account pages */}
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/profile" element={<CustomerProfile />} />
        <Route path="/search" element={<SearchMapPage />} /> {/* 🌍 Map/Search */}

        {/* ===== BUSINESS ROUTES ===== */}
        {/* IMPORTANT: Starts with /dashboard, not /business */}
        <Route path="/dashboard" element={<BusinessDashboard />} />
        <Route path="/dashboard/services" element={<BusinessServices />} />
        <Route path="/dashboard/bookings" element={<BusinessBookings />} />
        <Route path="/dashboard/profile" element={<BusinessProfile />} />

      </Routes>
    </Router>
  );
};

export default App;
