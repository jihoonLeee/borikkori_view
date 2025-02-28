import axios from 'axios';

export const initializePost = async () => {
  const response = await axios.post('/post/init', {}, { withCredentials: true });
  return response.data; // { postId, temp, title }
};

export const createPost = async ({ postId, title, contents }) => {
  const response = await axios.post(
    '/post',
    { postId, title, contents },
    { withCredentials: true }
  );
  return response.data;
};

export const uploadImage = async ({ file, postId }) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('postId', postId);
  const response = await axios.post('/file/image/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data; // 이미지 URL 반환
};
