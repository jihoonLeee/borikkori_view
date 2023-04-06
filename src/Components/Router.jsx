import React from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import AboutPage from "../Pages/About/about";
import TestPage from "../Pages/About/test";


export default function Router() {
  return (
    <BrowserRouter>
      <nav>
        <NavLink className={({ isActive }) => "nav-link" + (isActive ? " click" : "")} to='/about'>
          About
        </NavLink>
        <NavLink className={({ isActive }) => "nav-link" + (isActive ? " click" : "")} to='/test'>
          <br/>Test
        </NavLink>
      </nav>
      <Routes>
        <Route path='/about' element={<AboutPage />} />
      </Routes>
      <Routes>
        <Route path='/test' element={<TestPage />} />
      </Routes>
    </BrowserRouter>
  );
}