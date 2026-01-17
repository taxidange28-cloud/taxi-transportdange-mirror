import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth
import Login from './components/Auth/Login';
import AdminLogin from './components/Admin/AdminLogin';  // ⬅️ NOUVEAU
import AdminDashboard from './components/Admin/AdminDashboard';
import UserManagement from './components/Admin/UserManagement';
import AdminStats from './components/Admin/AdminStats';
// Layout
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';

// Secrétaire
import SecretaireDashboard from './components/Secretaire/Dashboard';
import CreerMission from './components/Secretaire/CreerMission';
import ListeMissions from './components/Secretaire/ListeMissions';
import Statistiques from './components/Secretaire/Statistiques';

// Chauffeur
import ChauffeurDashboard from './components/Chauffeur/Dashboard';
import MesMissions from './components/Chauffeur/MesMissions';
import DetailMission from './components/Chauffeur/DetailMission';

// Route protégée
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Layout avec Header et Sidebar
const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar - hidden on mobile by default */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-30 lg:z-0
          transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 transition-transform duration-300 ease-in-out
        `}>
          <Sidebar />
        </div>
        
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed bottom-4 right-4 lg:hidden bg-primary text-white p-4 rounded-full shadow-lg z-40"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {sidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Routes Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRole="admin">
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/stats"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminStats />
              </ProtectedRoute>
            }
          />

          {/* Routes Secrétaire */}
          <Route
            path="/secretaire/dashboard"
            element={
              <ProtectedRoute allowedRole="secretaire">
                <DashboardLayout>
                  <SecretaireDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/secretaire/creer-mission"
            element={
              <ProtectedRoute allowedRole="secretaire">
                <DashboardLayout>
                  <CreerMission />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/secretaire/missions"
            element={
              <ProtectedRoute allowedRole="secretaire">
                <DashboardLayout>
                  <ListeMissions />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/secretaire/stats"
            element={
              <ProtectedRoute allowedRole="secretaire">
                <DashboardLayout>
                  <Statistiques />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Routes Chauffeur */}
          <Route
            path="/chauffeur/dashboard"
            element={
              <ProtectedRoute allowedRole="chauffeur">
                <DashboardLayout>
                  <ChauffeurDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/chauffeur/missions"
            element={
              <ProtectedRoute allowedRole="chauffeur">
                <DashboardLayout>
                  <MesMissions />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/chauffeur/mission/:id"
            element={
              <ProtectedRoute allowedRole="chauffeur">
                <DashboardLayout>
                  <DetailMission />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          {/* Route 404 - Catch all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
