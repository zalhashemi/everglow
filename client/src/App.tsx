import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// auth pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import BusinessDetailsRegistration from './pages/auth/BusinessDetailsRegistration';

// customer pages
import LandingPage from './pages/customer/LandingPage';
import Homepage from './pages/customer/Homepage';
import BusinessPage from './pages/customer/BusinessPage';
import BookingsPage from './pages/customer/BookingsPage';
import CustomerProfile from './pages/customer/Profile';
import SearchMapPage from './pages/customer/searchMapPage'; // 🌍 NEW
import SelectDatePage from "./pages/customer/SelectDatePage";
import BookingSummaryPage from "./pages/customer/BookingSummaryPage";
import BookingReceiptPage from "./pages/customer/BookingReceiptPage"; 


// business pages
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
<Route path="/book/select-date" element={<SelectDatePage />} />
<Route path="/book/summary" element={<BookingSummaryPage />} />
<Route path="/bookings" element={<BookingsPage />} />
<Route path="/profile" element={<CustomerProfile />} />
        <Route path="/search" element={<SearchMapPage />} />
        <Route path="/book/receipt/:id" element={<BookingReceiptPage />} />
        <Route path="/bookings/:id" element={<BookingReceiptPage />} />



        {/* ===== BUSINESS ROUTES ===== */}
        <Route path="/business/dashboard" element={<BusinessDashboard />} />
        <Route path="/business/services" element={<BusinessServices />} />
        <Route path="/business/bookings" element={<BusinessBookings />} />
        <Route path="/business/profile" element={<BusinessProfile />} />
      </Routes>
    </Router>
  );
};

export default App;
