import { useLocation } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/Routes';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminFooter from './components/AdminFooter';
import AdminHeader from './components/AdminHeader';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname === '/admin' || location.pathname.startsWith('/admin/');

  return (
    <div>
      {isAdminRoute ? <AdminHeader /> : <Header />}
      <div style={{ marginTop: '10px', marginBottom: '10px' }}>
        <AppRoutes />
      </div>
      {isAdminRoute ? <AdminFooter /> : <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}