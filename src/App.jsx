import { Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CrmProvider } from './context/CrmContext';
import LandingPage from './pages/LandingPage';
import AdminLayout from './pages/Admin/AdminLayout';
import LoginPage from './pages/Admin/LoginPage';
import DashboardPage from './pages/Admin/DashboardPage';
import CrmBoard from './pages/Admin/CrmBoard';
import FinancePage from './pages/Admin/FinancePage';
import ReportsPage from './pages/Admin/ReportsPage';
import ClientsPage from './pages/Admin/ClientsPage';
import SettingsPage from './pages/Admin/SettingsPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CrmProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <>
              <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
              <main style={{ flex: 1 }}>
                <LandingPage />
              </main>
              <Footer />
              <FloatingWhatsApp />
            </>
          } />

          {/* Admin Routes */}
          <Route path="/admin/login" element={
            <>
              <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                <button className="btn btn-secondary" onClick={toggleTheme} style={{ padding: '0.5rem' }}>
                  {isDarkMode ? '🌞 Claro' : '🌙 Escuro'}
                </button>
              </div>
              <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LoginPage />
              </main>
            </>
          } />

          <Route path="/admin" element={<AdminLayout isDarkMode={isDarkMode} toggleTheme={toggleTheme} />}>
            <Route index element={<DashboardPage />} />
            <Route path="kanban" element={<CrmBoard />} />
            <Route path="finance" element={<FinancePage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </CrmProvider>
    </div>
  );
}

export default App;
