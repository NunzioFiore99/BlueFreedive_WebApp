import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginComponent from './components/login/LoginComponent';
import HomeComponent from './components/home/HomeComponent';
import ProfileComponent from './components/home/components/profile/ProfileComponent';
import DiveSessionComponent from './components/home/components//diveSession/DiveSessionComponent';
import UserComponent from './components/home/components//user/UserComponent';

const RequireAuth = ({ children, roles }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.some((role) => user.roles.includes(role))) return <Navigate to="/profile" />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/" element={<RequireAuth><HomeComponent /></RequireAuth>}>
            <Route path="profile" element={<ProfileComponent />} />
            <Route path="dive-sessions" element={<DiveSessionComponent />} />
            <Route
              path="manage-users"
              element={<RequireAuth roles={['ROLE_ADMIN']}><UserComponent /></RequireAuth>}
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
