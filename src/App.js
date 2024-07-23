import React, { useState, useEffect, Suspense } from 'react';
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import ReactGA from "react-ga4";
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import { AuthProvider } from './modules/AuthProvider';
import routes from './routes/routes';
import './App.css';

const trackingId = "G-2G1F6RJ26H"; // Google Analytics tracking ID

export default function App() {
  const [result] = useState([]);

  useEffect(() => {
    ReactGA.initialize(trackingId);
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });
  }, []);

  return (
    <AuthProvider>
      <div className='App' style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Router>
          <Header />
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              {routes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element}>
                  {route.children && route.children.map((child, idx) => (
                    <Route key={idx} path={child.path} element={child.element} />
                  ))}
                </Route>
              ))}
            </Routes>
          </Suspense>
          <Footer />
        </Router>
      </div>
    </AuthProvider>
  );
}
