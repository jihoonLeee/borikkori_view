import { useQuery } from 'react-query';
import axiosInstance from '../../api/axiosInstance';

const fetchMbtiResult = async (result) => {
  const response = await axiosInstance.post('/mbti', { result: result.toUpperCase() });
  return response.data;
};

export const useDogMbtiQuery = (result) => {
  return useQuery(['dogMbti', result], () => fetchMbtiResult(result), { retry: false });
};
