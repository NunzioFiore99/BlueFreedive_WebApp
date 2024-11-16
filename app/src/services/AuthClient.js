import axiosLoginInstance from './AxiosLoginInstance';

export const registerUser = async (userData) => {
  try {
    const response = await axiosLoginInstance.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/signup`, userData);
    return response.data;
  } catch (error) {
    throw new Error('SignUp error');
  }
};

export const loginUser = async (username, password) => {
  try {
    const response = await axiosLoginInstance.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/login`, { username, password });
    return response.data;
  } catch (error) {
    throw new Error('Login error');
  }
};

export const newAccessToken = async () => {
  try {
    const response = await axiosLoginInstance.get(`${process.env.REACT_APP_SERVER_URL}/api/auth/accessToken`, { addAuthHeader: true });
    return response.data;
  } catch (error) {
    throw new Error('Retrieve token error');
  }
};

export const logoutUser = async () => {
  try {
    const response = await axiosLoginInstance.get(`${process.env.REACT_APP_SERVER_URL}/api/auth/logout`, { addAuthHeader: true });
    return response.data;
  } catch (error) {
    throw new Error('Retrieve token error');
  }
};
