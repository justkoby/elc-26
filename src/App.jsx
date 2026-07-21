import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Partners from './components/Partners';
import InfoBar from './components/InfoBar';
import GalleryStrip from './components/GalleryStrip';
import About from './components/About';
import CohortStatement from './components/CohortStatement';
import Programme from './components/Programme';
import Tracks from './components/Tracks';
import Assembly from './components/Assembly';
import Who from './components/Who';
import Ambassadors from './components/Ambassadors';
import FAQ from './components/FAQ';
import Register from './components/Register';
import Footer from './components/Footer';

// Admin & Portal Routes
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Portal from './components/Portal';

function LandingPage() {
  return (
    <div className="app-container">
      <Navbar />
      <Hero />
      <Partners />
      <InfoBar />
      <GalleryStrip />
      <About />
      <CohortStatement />
      <Programme />
      <Tracks />
      <Assembly />
      <Who />
      <Ambassadors />
      <FAQ />
      <Register />
      <Footer />
    </div>
  );
}

// Redirect Handler for static fallback rewrites
function RedirectHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectPath = sessionStorage.getItem('redirect_path');
    if (redirectPath) {
      sessionStorage.removeItem('redirect_path');
      navigate(redirectPath, { replace: true });
    }
  }, [navigate]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <RedirectHandler />
      <Routes>
        {/* Public Website */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/portal" element={<Portal />} />
        <Route path="/register" element={<Portal />} />

        {/* Custom Admin Auth & Protected Dashboard */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
