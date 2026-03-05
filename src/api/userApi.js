import axiosInstance from './axiosInstance';

export const joinUser = async (credentials) => {
  const response = await axiosInstance.post('/user/join', credentials);
  return response.data;
};

export const sendEmailVerification = async (email) => {
  const response = await axiosInstance.post('/user/sendEmail', { email });
  if (response.status !== 200) throw new Error('Verification failed');
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await axiosInstance.post('/user/login', credentials);
  return response.data;
};
