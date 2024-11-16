import axios from 'axios';

export const loginUser = async (username, password) => {
  try {
    console.log("stampo: ", process.env.REACT_APP_SERVER_URL);
    const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/login`, { username, password });
    return response.data;
  } catch (error) {
    throw new Error('Login error');
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/signup`, userData);
    return response.data;
  } catch (error) {
    throw new Error('SignUp error');
  }
};