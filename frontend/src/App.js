import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DepartmentPage from './pages/DepartmentPage';
import ProgrammePage from './pages/ProgrammePage';
import BlockPage from './pages/BlockPage';
import RoomPage from './pages/RoomPage';
import RolePage from './pages/RolePage';
import UserPage from './pages/UserPage';
import ComplaintFormPage from './pages/ComplaintFormPage';
import ComplaintsDashboardPage from './pages/ComplaintsDashboardPage';
import UserComplaintDashboardPage from './pages/UserComplaintDashboardPage';
import ReportsPage from './pages/ReportsPage';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="loading">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⏳</div>
          <div>Connecting to server...</div>
          <div style={{ fontSize: '0.85rem', marginTop: '8px', opacity: 0.7 }}>
            Server may be waking up. Please wait...
          </div>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const SuperAdminRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="loading">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⏳</div>
          <div>Connecting to server...</div>
          <div style={{ fontSize: '0.85rem', marginTop: '8px', opacity: 0.7 }}>
            Server may be waking up. Please wait...
          </div>
        </div>
      </div>
    );
  }

  return isAuthenticated && user?.role === 'SuperAdmin' ? children : <Navigate to="/" />;
};

const basename = window.location.hostname === 'eswaran102005.github.io' ? '/TMS-Project' : '';

function App() {
  return (
    <Router basename={basename} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* SuperAdmin Only Routes */}
          <Route
            path="/departments"
            element={
              <SuperAdminRoute>
                <DepartmentPage />
              </SuperAdminRoute>
            }
          />
          <Route
            path="/programmes"
            element={
              <SuperAdminRoute>
                <ProgrammePage />
              </SuperAdminRoute>
            }
          />
          <Route
            path="/blocks"
            element={
              <SuperAdminRoute>
                <BlockPage />
              </SuperAdminRoute>
            }
          />
          <Route
            path="/rooms"
            element={
              <SuperAdminRoute>
                <RoomPage />
              </SuperAdminRoute>
            }
          />
          <Route
            path="/roles"
            element={
              <SuperAdminRoute>
                <RolePage />
              </SuperAdminRoute>
            }
          />
          <Route
            path="/users"
            element={
              <SuperAdminRoute>
                <UserPage />
              </SuperAdminRoute>
            }
          />
          <Route
            path="/complaints/new"
            element={
              <ProtectedRoute>
                <ComplaintFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-complaints"
            element={
              <ProtectedRoute>
                <UserComplaintDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/complaints"
            element={
              <ProtectedRoute>
                <ComplaintsDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <SuperAdminRoute>
                <ReportsPage />
              </SuperAdminRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
