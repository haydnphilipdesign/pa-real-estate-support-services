import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import AgentDashboard from './pages/AgentDashboard';
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Services from './pages/Services';
import WorkWithMe from './pages/WorkWithMe';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import IntakeForm from './pages/IntakeForm';
import AgentPortal from './pages/AgentPortal';
import theme from './theme';
import ScrollRestoration from './components/ScrollRestoration';
import { AppProviders } from './providers/AppProviders';
import { TransactionForm } from './components/TransactionForm';

const App: React.FC = () => {
  const location = useLocation();
  const hideFooterPaths = ['/agent-portal'];
  const shouldShowFooter = !hideFooterPaths.includes(location.pathname);

  return (
    <AppProviders>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ScrollRestoration />
        <Header />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/services" element={<Services />} />
            <Route path="/work-with-me" element={<WorkWithMe />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/login" element={<Login />} />
            <Route path="/intake-form" element={<IntakeForm />} />
            
            {/* Protected Routes */}
            <Route
              path="/agent-portal"
              element={
                <ProtectedRoute>
                  <AgentPortal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/agent"
              element={
                <ProtectedRoute>
                  <AgentDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        {shouldShowFooter && <Footer />}
      </ThemeProvider>
    </AppProviders>
  );
};

export default App;
