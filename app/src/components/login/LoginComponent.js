import React, { useState } from 'react';
import './LoginComponent.css';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../../services/AuthService';
import Button from '@mui/material/Button';

const LoginComponent = () => {
  const navigate = useNavigate(); 
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    roles: ['USER']
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const response = await loginUser(formData.username, formData.password);
        console.log(response.data);
        if (response.accessToken) {
          localStorage.setItem('accessToken', response.accessToken);
          navigate('/home');
        }
      } else {
        const response = await registerUser(formData);
        console.log(response);
        if (response) {
          setIsLogin(!isLogin);
          console.log("esegui la login");
        }
      }
    } catch (error) {
      setError('Si è verificato un errore.');
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <h2>{isLogin ? 'Accedi' : 'Registrati'}</h2>

      <form onSubmit={handleSubmit}>
        {isLogin ? (
          <>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </>
        ) : (
          <>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </>
        )}
        {error && <p className="error">{error}</p>}
        <button type="submit">{isLogin ? 'Accedi' : 'Registrati'}</button>
      </form>

      {isLogin ? <div className='switch-login-button-container'><p className='switch-login-text'>Non hai un account? </p> <Button variant="text" onClick={() => setIsLogin(!isLogin)}>Registrati</Button></div> 
      : <div className='switch-login-button-container'> <p className='switch-login-text'>Hai già un account?</p> <Button variant="text" onClick={() => setIsLogin(!isLogin)}>Accedi</Button></div>}
    </div>
  );
};

export default LoginComponent;