import axiosInstance from './AxiosInstance';

export const retrieveDiveSessions = async () => {
  try {
    const response = await axiosInstance.get(`${process.env.REACT_APP_SERVER_URL}/api/diveSessions`);
    return response.data;
  } catch (error) {
    throw new Error('Retrieve dive sessions error');
  }
};

export const retrieveDiveSession = async (id) => {
  try {
    const response = await axiosInstance.get(`${process.env.REACT_APP_SERVER_URL}/api/diveSessions/` + id);
    return response.data;
  } catch (error) {
    throw new Error('Retrieve dive session error');
  }
};

export const deleteDiveSession = async (id) => {
  try {
    const response = await axiosInstance.delete(`${process.env.REACT_APP_SERVER_URL}/api/diveSessions/` + id);
    return response.data;
  } catch (error) {
    throw new Error('delete dive session error');
  }
};

export const createDiveSessionMe = async (body) => {
  try {
    const response = await axiosInstance.post(`${process.env.REACT_APP_SERVER_URL}/api/diveSessions/me`, body);
    return response.data;
  } catch (error) {
    throw new Error('create dive session error');
  }
};

export const retrieveDiveSessionsMe = async () => {
  try {
    const response = await axiosInstance.get(`${process.env.REACT_APP_SERVER_URL}/api/diveSessions/me`);
    return response.data;
  } catch (error) {
    throw new Error('Retrieve my dive sessions error');
  }
};

export const retrieveDiveSessionMe = async (id) => {
  try {
    const response = await axiosInstance.get(`${process.env.REACT_APP_SERVER_URL}/api/diveSessions/me/` + id);
    return response.data;
  } catch (error) {
    throw new Error('Retrieve my dive session error');
  }
};

export const updateDiveSessionMe = async (id, body) => {
  try {
    const response = await axiosInstance.put(`${process.env.REACT_APP_SERVER_URL}/api/diveSessions/me/` + id, body);
    return response.data;
  } catch (error) {
    throw new Error('Update my dive session error');
  }
};

export const deleteDiveSessionMe = async (id) => {
  try {
    const response = await axiosInstance.delete(`${process.env.REACT_APP_SERVER_URL}/api/diveSessions/me/` + id);
    return response.data;
  } catch (error) {
    throw new Error('Delete my dive session error');
  }
};
