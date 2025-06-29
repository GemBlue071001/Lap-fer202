import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import OrchidDetailPage from './pages/OrchidDetailPage';
import ContactPage from './pages/ContactPage';
import RegisterPage from './pages/RegisterPage';
import AdminOrchidPage from './pages/AdminOrchidPage';
import ProtectedRoute from './component/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/orchid/:id" element={<OrchidDetailPage />} />
        <Route path="/contact" element={<ContactPage />} />
        
        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/admin/orchids" element={<AdminOrchidPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
