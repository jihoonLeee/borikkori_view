// src/components/layout/Layout.jsx
import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 헤더 영역 */}
      <Header />
      {/* 메인 영역 */}
      <main className="flex-grow">
        {children}
      </main>
      
      {/* 푸터 영역 */}
      <Footer />
    </div>
  );
};

export default Layout;
