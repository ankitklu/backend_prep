// App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthProvider";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard";
import LocationForm from "./pages/LocationForm";
import PostGenerator from "./pages/PostGenerator";
import CommunicationLanding from "./pages/Communications/CommunicationLanding";
import AdminManagement from "./pages/AdminManagement";
import MeetingsDashboard from "./pages/Meetings/MeetingsDashboard";
import CampaignHome from "./pages/Campaigns/CampaignHome";
import { LmsDashboard } from "./pages/LMS/LmsDashboard";
import BottomNavBar from "./components/BottomNavBar";
import Chatbot from "./components/Chatbot";

/** Wrapper that protects everything beneath it */
function PrivateLayout() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) return <Navigate to="/" replace />;

  // logged-in view: show the page + shared UI (navbar, chatbot, …)
  return (
    <>
      <Outlet />
      <BottomNavBar />
      <Chatbot />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* public route */}
          <Route path="/" element={<Login />} />

          {/* all routes inside PrivateLayout require auth */}
          <Route element={<PrivateLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/location-form" element={<LocationForm />} />
            <Route path="/post-generator" element={<PostGenerator />} />
            <Route path="/communications" element={<CommunicationLanding />} />
            <Route path="/admin" element={<AdminManagement />} />
            <Route path="/meetings" element={<MeetingsDashboard />} />
            <Route path="/campaigns" element={<CampaignHome />} />
            <Route path="/lms" element={<LmsDashboard />} />
          </Route>

          {/* catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
