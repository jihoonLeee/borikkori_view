import axios from 'axios';

export const initializePost = async () => {
  const response = await axios.post('/post/init', {}, { 
    withCredentials: true });
    console.log(response.data);
  return response.data; 
};

export const createPost = async ({ postId, title, contents,isTemp }) => {
  const response = await axios.post(
    '/post',
    { postId, title, contents ,isTemp},
    { withCredentials: true }
  );
  return response.data;
};

export const deletePost = async (postId) => {
  const response = await axios.delete(`/post/${postId}`, {
    withCredentials: true,
  });
  return response.data;
};



export const uploadImage = async ({ file, postId }) => {
  console.log(file);
  console.log(postId);
  const formData = new FormData();
  formData.append('file', file);
  formData.append('postId', postId);
  const response = await axios.post('/file/image/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data; // 이미지 URL 반환
};
