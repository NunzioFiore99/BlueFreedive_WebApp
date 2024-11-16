import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_SERVER_URL}`,
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
      if (config && config.headers && config.addAuthHeader) {
        const { getAccessToken } = useAuth();
        const token = getAccessToken();
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401) {
        console.log('Token scaduto o invalido. Effettuando il logout...');
        const { logout } = useAuth();
        logout();
        const navigate = useNavigate();
        navigate('/login');
        console.log('Ripeti la login...');
        return Promise.reject(error);
      }
      return Promise.reject(error);
    }
  );

export default axiosInstance;