import axios from 'axios';
import { updateGlobalAccessToken } from '../context/AuthContext';

const axiosLoginInstance = axios.create({
    baseURL: `${process.env.REACT_APP_SERVER_URL}`,
});

axiosLoginInstance.interceptors.request.use(
    (config) => {
      if (config && config.headers && config.addAuthHeader) {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error instanceof Error ? error : new Error('An unknown error occurred.'));
    }
);

axiosLoginInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401) {
        console.log('Refresh Token expired or invalid. Logout...');
        updateGlobalAccessToken(null);
        window.location.href = '/login';
      }
      return Promise.reject(error instanceof Error ? error : new Error('An unknown error occurred.'));
    }
  );

export default axiosLoginInstance;