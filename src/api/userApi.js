import axios from 'axios';

export const joinUser = async (credentials) => {
  const response = await axios.post('/user/join', credentials, { withCredentials: true });
  return response.data;
};

export const sendEmailVerification = async (email) => {
  const response = await axios.post(
    '/user/sendEmail',
    { email },
    { headers: { 'Content-Type': 'application/json' } },
     {withCredentials: true}
  );
  if (response.status !== 200) throw new Error('Verification failed');
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await axios.post('/user/login', credentials, { withCredentials: true });
  return response.data;
};
