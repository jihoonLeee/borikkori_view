import { useQuery } from "react-query";
import axios from "axios";

const fetchMbtiResult = async (result) => {
  const response = await axios.post(
    '/mbti',
    { result: result.toUpperCase() },
    { withCredentials: true }
  );
  return response.data;
};

export const useDogMbtiQuery = (result) => {
  return useQuery(['dogMbti', result], () => fetchMbtiResult(result), { retry: false });
};
