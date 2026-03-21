import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import LoginView from './views/LoginView'
import RegisterView from './views/RegisterView'
import './index.css'

// Componente para proteger rotas privadas
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-secondary rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

import { FilterProvider } from './context/FilterContext'

function App() {
  return (
    <AuthProvider>
      <FilterProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginView />} />
            <Route path="/register" element={<RegisterView />} />
            <Route 
              path="/*" 
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              } 
            />
          </Routes>
        </BrowserRouter>
      </FilterProvider>
    </AuthProvider>
  )
}

export default App
