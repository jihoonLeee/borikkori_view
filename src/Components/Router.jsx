import React from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import AboutPage from "../Pages/About/about";


export default function Router() {
  return (
    <BrowserRouter>
      <nav>
        <NavLink className={({ isActive }) => "nav-link" + (isActive ? " click" : "")} to='/about'>
          About
        </NavLink>
      </nav>
      <Routes>
        <Route path='/about' element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  );
}