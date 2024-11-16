import axiosInstance from './AxiosInstance';

export const retrieveUserProfileMe = async () => {
  try {
    const response = await axiosInstance.get(`${process.env.REACT_APP_SERVER_URL}/api/userProfiles/me`);
    return response.data;
  } catch (error) {
    throw new Error('Error');
  }
};

export const updateUserProfileMe = async (body) => {
  try {
    const response = await axiosInstance.put(`${process.env.REACT_APP_SERVER_URL}/api/userProfiles/me`, body);
    return response.data;
  } catch (error) {
    throw new Error('Error');
  }
};
