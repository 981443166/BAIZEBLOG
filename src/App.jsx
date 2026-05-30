import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './hooks/useAuth.jsx';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Articles from './components/Articles';
import Hero from './components/Hero';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

// 滚动到顶部组件
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// 页面过渡动画包装器
function PageTransition({ children }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: 0.4,
          ease: [0.25, 0.1, 0.25, 1],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-stone-50 text-stone-800 dark:bg-stone-950 dark:text-stone-200 font-serif transition-colors duration-300">
          <Navbar />
          <ScrollToTop />
          <div className="pt-16">
            <Routes>
              <Route
                path="/"
                element={
                  <PageTransition>
                    <Home />
                  </PageTransition>
                }
              />
              <Route
                path="/articles"
                element={
                  <PageTransition>
                    <Articles />
                  </PageTransition>
                }
              />
              <Route
                path="/article/:id"
                element={
                  <PageTransition>
                    <Hero />
                  </PageTransition>
                }
              />
              <Route
                path="/login"
                element={
                  <PageTransition>
                    <LoginPage />
                  </PageTransition>
                }
              />
              <Route
                path="/admin"
                element={
                  <PageTransition>
                    <AdminPage />
                  </PageTransition>
                }
              />
              <Route
                path="/about"
                element={
                  <PageTransition>
                    <AboutPage />
                  </PageTransition>
                }
              />
              <Route
                path="/profile"
                element={
                  <PageTransition>
                    <ProfilePage />
                  </PageTransition>
                }
              />
              <Route
                path="/settings"
                element={
                  <PageTransition>
                    <SettingsPage />
                  </PageTransition>
                }
              />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
