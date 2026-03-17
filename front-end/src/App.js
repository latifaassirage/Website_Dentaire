import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';

// Public Components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Register from './pages/Register';
import AuthPage from './pages/auth/AuthPage';

// Admin Components
import AdminNavbar from './components/admin/AdminNavbar';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import Agenda from './pages/admin/Agenda';
import Patients from './pages/admin/Patients';
import WaitingList from './pages/admin/WaitingList';
import Finance from './pages/admin/Finance';
import Parameters from './pages/admin/Parameters';

// Patient Components
import PatientDashboard from './pages/patient/PatientDashboard';
import Booking from './pages/patient/Booking';
import Documents from './pages/patient/Documents';
import History from './pages/patient/History';
import Payments from './pages/patient/Payments';
import Messages from './pages/patient/Messages';
import Info from './pages/patient/Info';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<AuthPage />} />

          {/* Admin Routes with AdminNavbar */}
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRole="admin">
              <div>
                <AdminNavbar />
                <div className="content-body">
                  <Routes>
                    <Route path="dashboard" element={<DashboardAdmin />} />
                    <Route path="agenda" element={<Agenda />} />
                    <Route path="patients" element={<Patients />} />
                    <Route path="waiting-list" element={<WaitingList />} />
                    <Route path="finance" element={<Finance />} />
                    <Route path="config" element={<Parameters />} />
                    <Route path="" element={<Navigate to="dashboard" replace />} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          } />

          {/* Patient Routes with Navbar */}
          <Route path="/patient/*" element={
            <ProtectedRoute allowedRole="patient">
              <div>
                <Navbar />
                <div style={{ padding: '40px 8%', minHeight: 'calc(100vh - 80px)' }}>
                  <Routes>
                    <Route path="dashboard" element={<PatientDashboard />} />
                    <Route path="booking" element={<Booking />} />
                    <Route path="documents" element={<Documents />} />
                    <Route path="history" element={<History />} />
                    <Route path="payments" element={<Payments />} />
                    <Route path="messages" element={<Messages />} />
                    <Route path="info" element={<Info />} />
                    <Route path="" element={<Navigate to="dashboard" replace />} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
