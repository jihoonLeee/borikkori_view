import React, { useEffect, Suspense } from 'react';
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import ReactGA from "react-ga4";
import { AuthProvider } from './contexts/AuthProvider';
import { ThemeProvider } from './contexts/ThemeProvider';
import routes from './routes/routes';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import BottomNavBar from './components/layout/BottomNavBar';
import './App.css';
import Spinner from './components/common/Spinner';
const trackingId = "G-2G1F6RJ26H"; // Google Analytics tracking ID

export default function App() {
  useEffect(() => {
    ReactGA.initialize(trackingId);
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>

        <div className="flex flex-col min-h-screen bg-secondary dark:bg-dark-surface text-content-primary dark:text-white transition-colors duration-200">
          <Router>
            <Header />

            {/* 메인 라우팅 영역 */}
            <div className="flex-grow pb-nav-height md:pb-0">
              <Suspense fallback={<Spinner />}>
                <Routes>
                  {routes.map((route, index) => (
                    <Route
                      key={index}
                      path={route.path}
                      element={route.element}
                    >
                      {route.children && route.children.map((child, idx) => (
                        <Route
                          key={idx}
                          path={child.path}
                          element={child.element}
                        />
                      ))}
                    </Route>
                  ))}
                </Routes>
              </Suspense>
            </div>

            <Footer />
            {/* 모바일 하단 탭바 */}
            <BottomNavBar />
          </Router>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}
