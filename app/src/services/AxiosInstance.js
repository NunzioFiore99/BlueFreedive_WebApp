import axios from 'axios';
import { useAuth } from '../context/AuthContext'
import { AuthClient } from './AuthClient';

const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_SERVER_URL}`,
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const { getAccessToken } = useAuth();
    const token = getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
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
      if (error.response && (error.response.status === 401 || error.response.status === 403 )) {
        try {
          console.log("access token scaduto recupero uno nuovo");
          const response = await AuthClient.newAccessToken();
          const newAccessToken = response.accessToken;
          const { login } = useAuth();
          login(newAccessToken);
          console.log("access token recuperato, riprovo la vecchia richiesta");
  
          // Ripeti la richiesta originale con il nuovo token
          error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosInstance(error.config);
        } catch (err) {
          console.error('Errore nel rinnovo del token:', err);
          return Promise.reject(err);
        }
      }
  
      return Promise.reject(error);
    }
  );

export default axiosInstance;