import React, { useState } from "react"
import './App.css'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Profile from "./pages/Profile"
import ErrorPage from './pages/ErrorPage';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"
import { useCookies } from 'react-cookie'
import ProtectedRoute from './components/ProtectedRoute'

const App = () => {

  const [cookies, setCookie, removeCookie] = useCookies(['cookie-user'])
  const token = cookies.UserId


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* {token &&<Route path="/dashboard" element={token ? <Dashboard /> : <Home />} />}
        {token &&<Route path="/profile" element={token ? <Profile /> : <Home />} />} */}
        <Route path="/dashboard" element={token ? <Dashboard /> : <Home />} />
        <Route path="/profile" element={token ? <Profile /> : <Home />} />
        <Route path="/error" element={token ? <ErrorPage /> : <Home />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
