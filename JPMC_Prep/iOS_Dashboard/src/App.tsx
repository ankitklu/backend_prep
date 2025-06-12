import Dashboard from "./pages/Dashboard"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthProvider';
import { Navigate } from 'react-router-dom';
import type { JSX } from "react";
import LocationForm from "./pages/LocationForm";
import BottomNavBar from "./components/BottomNavBar";
import PostGenerator from "./pages/PostGenerator";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/" replace />;
}

function App() {
  return (
      <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/location-form" element={
              <LocationForm />
          } />
          <Route path="/post-generator" element={
            <PostGenerator/>
          }/>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <BottomNavBar/>
      </Router>
    </AuthProvider>
  )
}

export default App