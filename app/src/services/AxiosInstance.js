import axios from 'axios';
import { updateGlobalAccessToken } from '../context/AuthContext'

const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_SERVER_URL}`,
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error instanceof Error ? error : new Error('An unknown error occurred.'));
  }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && (error.response.status === 401 || error.response.status === 403 )) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/auth/accessToken`, {withCredentials: true});
          const newAccessToken = response.data.accessToken;
          updateGlobalAccessToken(newAccessToken);
          console.log("New access token retrieved and updated...");
          // Retry original request with new token
          error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosInstance(error.config);
        } catch (err) {
          return Promise.reject(new Error('Retrieve new access token error.'));
        }
      }
  
      return Promise.reject(error instanceof Error ? error : new Error('An unknown error occurred.'));
    }
  );

export default axiosInstance;