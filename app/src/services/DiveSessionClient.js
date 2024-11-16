import axiosInstance from './AxiosInstance';

export const retrieveDiveSessions = async () => {
  try {
    const response = await axiosInstance.get(`${process.env.REACT_APP_SERVER_URL}/api/diveSessions`);
    return response.data;
  } catch (error) {
    throw new Error('Error');
  }
};

export const retrieveDiveSession = async (id) => {
  try {
    const response = await axiosInstance.get(`${process.env.REACT_APP_SERVER_URL}/api/diveSessions/` + id);
    return response.data;
  } catch (error) {
    throw new Error('Error');
  }
};

export const deleteDiveSession = async (id) => {
  try {
    const response = await axiosInstance.delete(`${process.env.REACT_APP_SERVER_URL}/api/diveSessions/` + id);
    return response.data;
  } catch (error) {
    throw new Error('Error');
  }
};

export const createDiveSessionMe = async (body) => {
  try {
    const response = await axiosInstance.post(`${process.env.REACT_APP_SERVER_URL}/api/diveSessions/me`, body);
    return response.data;
  } catch (error) {
    throw new Error('Error');
  }
};

export const retrieveDiveSessionsMe = async () => {
  try {
    const response = await axiosInstance.get(`${process.env.REACT_APP_SERVER_URL}/api/diveSessions/me`);
    return response.data;
  } catch (error) {
    throw new Error('Error');
  }
};

export const retrieveDiveSessionMe = async (id) => {
  try {
    const response = await axiosInstance.get(`${process.env.REACT_APP_SERVER_URL}/api/diveSessions/me/` + id);
    return response.data;
  } catch (error) {
    throw new Error('Error');
  }
};

export const updateDiveSessionMe = async (id, body) => {
  try {
    const response = await axiosInstance.put(`${process.env.REACT_APP_SERVER_URL}/api/diveSessions/me/` + id, body);
    return response.data;
  } catch (error) {
    throw new Error('Error');
  }
};

export const deleteDiveSessionMe = async (id) => {
  try {
    const response = await axiosInstance.delete(`${process.env.REACT_APP_SERVER_URL}/api/diveSessions/me/` + id);
    return response.data;
  } catch (error) {
    throw new Error('Error');
  }
};
