import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import SearchPage from './pages/SearchPage';
import MapViewPage from './pages/MapViewPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminPropertiesPage from './pages/AdminPropertiesPage';
import AdminPropertyFormPage from './pages/AdminPropertyFormPage';

// Create a React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App min-h-screen flex flex-col">
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#4ade80',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />

            <Routes>
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              
              {/* Protected Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute adminOnly>
                    <>
                      <Navbar />
                      <main className="flex-1">
                        <AdminDashboardPage />
                      </main>
                    </>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/properties" 
                element={
                  <ProtectedRoute adminOnly>
                    <>
                      <Navbar />
                      <main className="flex-1">
                        <AdminPropertiesPage />
                      </main>
                    </>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/properties/new" 
                element={
                  <ProtectedRoute adminOnly>
                    <>
                      <Navbar />
                      <main className="flex-1">
                        <AdminPropertyFormPage />
                      </main>
                    </>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/properties/:id/edit" 
                element={
                  <ProtectedRoute adminOnly>
                    <>
                      <Navbar />
                      <main className="flex-1">
                        <AdminPropertyFormPage />
                      </main>
                    </>
                  </ProtectedRoute>
                } 
              />

              {/* Public Routes */}
              <Route path="/*" element={
                <>
                  <Navbar />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/properties" element={<PropertiesPage />} />
                      <Route path="/properties/:id" element={<PropertyDetailPage />} />
                      <Route path="/search" element={<SearchPage />} />
                      <Route path="/map" element={<MapViewPage />} />
                      
                      {/* 404 Route */}
                      <Route path="*" element={
                        <div className="min-h-screen flex items-center justify-center">
                          <div className="text-center">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                            <p className="text-gray-600 mb-6">Page not found</p>
                            <a href="/" className="btn btn-primary">
                              Go Home
                            </a>
                          </div>
                        </div>
                      } />
                    </Routes>
                  </main>
                  <Footer />
                </>
              } />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
