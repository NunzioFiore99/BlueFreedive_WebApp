import axios from 'axios';
import { getGlobalAccessToken, updateGlobalAccessToken } from '../context/AuthContext'

const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_SERVER_URL}`,
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getGlobalAccessToken();
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
          const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/auth/accessToken`, {withCredentials: true});
          const newAccessToken = response.data.accessToken;
          updateGlobalAccessToken(newAccessToken);
          console.log("New access token retrieved and updated...");
          // Ripeto la richiesta originale con il nuovo token
          error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosInstance(error.config);
        } catch (err) {
          console.error('Retrieve new access token error:', err);
          return Promise.reject(err);
        }
      }
  
      return Promise.reject(error);
    }
  );

export default axiosInstance;