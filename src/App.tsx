import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import OrchidDetailPage from './pages/OrchidDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/orchid/:id" element={<OrchidDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
