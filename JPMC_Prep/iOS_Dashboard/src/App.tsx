import Dashboard from "./pages/dashboard"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthProvider';
import { Navigate } from 'react-router-dom';
import type { JSX } from "react";
import LocationForm from "./pages/LocationForm";
import BottomNavBar from "./components/BottomNavBar";
import PostGenerator from "./pages/PostGenerator";
import CommunicationLanding from "./pages/Communications/CommunicationLanding"
import AdminManagement from "./pages/AdminManagement";
import MeetingsDashboard from "./pages/Meetings/MeetingsDashboard";
import Chatbot from "./components/Chatbot";
import CampaignHome from "./pages/Campaigns/CampaignHome";
import { LmsDashboard } from "./pages/LMS/LmsDashboard";

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
          <Route path="/communications" element={
            <CommunicationLanding />
          }/>
          <Route path="/admin" element={
            <AdminManagement/>
          }/>
          <Route path="/meetings" element={<MeetingsDashboard />} />
          <Route path="/campaigns" element={<CampaignHome />} />
          <Route path="/lms" element={<LmsDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <BottomNavBar/>
        <Chatbot />
      </Router>
    </AuthProvider>
  )
}

export default App