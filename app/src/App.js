import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RequireAuth from './context/RequireAuth';
import LoginComponent from './components/login/LoginComponent';
import HomeComponent from './components/home/HomeComponent';
import HomepageComponent from './components/home/components/homepage/HomepageComponent';
import ProfileComponent from './components/home/components/profile/ProfileComponent';
import DiveSessionComponent from './components/home/components//diveSession/DiveSessionComponent';
import UserComponent from './components/home/components//user/UserComponent';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginComponent />} />
          <Route element={<RequireAuth roles={['ROLE_ADMIN', 'ROLE_USER']} />}>
            <Route path="/" element={<HomeComponent />} >
              <Route index element={<HomepageComponent />} /> 
              <Route path="/profile" element={<ProfileComponent />} />
              <Route path="/dive" element={<DiveSessionComponent />} />
              <Route element={<RequireAuth roles={['ROLE_ADMIN']} />}>
                <Route path="/users-management" element={<UserComponent />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
