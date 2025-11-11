import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import CalendarPage from './pages/CalendarPage';
import Sidebar from './pages/Sidebar';
import OrganizerEventsPage from './pages/OrganizerEventsPage';
import CreateEventPage from './pages/CreateEventPage';
import ProfilePage from './pages/ProfilePage';
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashBoard from "./pages/Dashboard";
import EditMapPage from './pages/EditMapPage';

import EventDetailsPage from "./pages/EventDetailsPage";
import EventParticipantsPage from './pages/EventParticipantsPage';
import LoginSupplier from "./pages/LoginSupplier";
import RegisterSupplier from './pages/RegisterSupplier';
import SupplierSidebar from "./pages/SupplierSidebar";
import SupplierDashboard from "./pages/SupplierDashboard";
import AddSupplierResource from './pages/AddSupplierResources';
import SupplierProfile from './pages/SupplierProfile';
import EditSupplierResource from './pages/EditSupplierResource';
import ForgotPasswordFlow from "./pages/ForgotPasswordFlow"; // NOVO: flow za zaboravljenu šifru

function AppWrapper() {
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("token");
  const isSupplierLoggedIn = !!localStorage.getItem("supplierToken");

  const hideSidebarRoutes = [
    "/", "/login", "/register", "/login-dobavljac", "/register-dobavljac"
  ];

  const shouldShowSidebar =
    isLoggedIn &&
    !hideSidebarRoutes.includes(location.pathname) &&
    !location.pathname.startsWith("/dobavljac");

  const shouldShowSupplierSidebar =
    isSupplierLoggedIn &&
    location.pathname.startsWith("/dobavljac") &&
    !hideSidebarRoutes.includes(location.pathname);

  // DODAJEMO KLASE (ne style!) na main-content
  // Ako sidebar NIJE prikazan, main-content treba da ima margin-left: 0
  const mainContentClass =
    shouldShowSidebar || shouldShowSupplierSidebar
      ? "main-content"
      : "main-content no-sidebar";

  return (
    <div className="layout-root">
      {shouldShowSidebar && <Sidebar />}
      {shouldShowSupplierSidebar && <SupplierSidebar />}
      <div className={mainContentClass}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/events" element={<OrganizerEventsPage />} />
          <Route path="/create" element={<CreateEventPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/edit-map" element={<EditMapPage />} />
          <Route path="/moji-dogadjaji" element={<OrganizerEventsPage />} />
     
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordFlow />} /> {/* OVO JE NOVO */}
          <Route path="/lista-prijavljenih/:id" element={<EventParticipantsPage />} />
          <Route path="/details/:id" element={<EventDetailsPage />} />
          <Route path="/EventParticipantsPage" element={<EventParticipantsPage />} />
          <Route path="/login-dobavljac" element={<LoginSupplier />} />
          <Route path="/register-dobavljac" element={<RegisterSupplier />} />
          <Route path="/dobavljac/dashboard" element={<SupplierDashboard />} />
          <Route path="/dobavljac/dodaj-resurs" element={<AddSupplierResource />} />
          <Route path="/dobavljac/profil" element={<SupplierProfile />} />
          <Route path="/dobavljac/izmeni-resurs/:id" element={<EditSupplierResource />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;