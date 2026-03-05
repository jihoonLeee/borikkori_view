import axiosInstance from './axiosInstance';

export const initializePost = async ({ categoryType }) => {
  const response = await axiosInstance.post('/post/init', { categoryType });
  return response.data;
};

export const createPost = ({ postId, title, contents, isTemp, categoryType, subCategoryType }) =>
  axiosInstance.post('/post', { postId, title, contents, isTemp, categoryType, subCategoryType });

export const deletePost = async (postId) => {
  const response = await axiosInstance.delete(`/post/${postId}`);
  return response.data;
};

export const uploadFile = async ({ file, postId }) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('postId', postId);
  const response = await axiosInstance.post('/file/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
