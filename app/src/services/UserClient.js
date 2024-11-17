import axiosInstance from './AxiosInstance';

export const createUsers = async (body) => {
  try {
    const response = await axiosInstance.post(`${process.env.REACT_APP_SERVER_URL}/api/users`, body);
    return response.data;
  } catch (error) {
    throw new Error('Create users error');
  }
};

export const retrieveUsers = async () => {
  try {
    const response = await axiosInstance.get(`${process.env.REACT_APP_SERVER_URL}/api/users`);
    return response.data;
  } catch (error) {
    throw new Error('Retrieve users error');
  }
};

export const retrieveUser = async (id) => {
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_SERVER_URL}/api/users/` + id);
      return response.data;
    } catch (error) {
      throw new Error('Retrieve user error');
    }
};

export const updateUser = async (id, body) => {
    try {
      const response = await axiosInstance.put(`${process.env.REACT_APP_SERVER_URL}/api/users/` + id, body);
      return response.data;
    } catch (error) {
      throw new Error('Update user error');
    }
};

export const deleteUser = async (id) => {
    try {
      const response = await axiosInstance.delete(`${process.env.REACT_APP_SERVER_URL}/api/users/` + id);
      return response.data;
    } catch (error) {
      throw new Error('Delete user error');
    }
};

export const retrieveUserMe = async () => {
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_SERVER_URL}/api/users/me`);
      return response.data;
    } catch (error) {
      throw new Error('Retrieve my user error');
    }
};

export const updateUserMe = async (body) => {
    try {
      const response = await axiosInstance.patch(`${process.env.REACT_APP_SERVER_URL}/api/users/me`, body);
      return response.data;
    } catch (error) {
      throw new Error('Update my user error');
    }
};