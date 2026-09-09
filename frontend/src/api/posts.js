import apiClient from './client';

export const getAllPosts = async () => {
  const response = await apiClient.get('/posts');
  return response.data;
};

export const getPostById = async (id) => {
  const response = await apiClient.get(`/posts/${id}`);
  return response.data;
};

export const createPost = async (postData) => {
  const response = await apiClient.post('/posts', postData);
  return response.data;
};

export const updatePost = async (id, postData) => {
  const response = await apiClient.put(`/posts/${id}`, postData);
  return response.data;
};

export const deletePost = async (id) => {
  const response = await apiClient.delete(`/posts/${id}`);
  return response.data;
};

export const getUserPosts = async (userId) => {
  const response = await apiClient.get(`/posts/user/${userId}`);
  return response.data;
};

export const getRelatedPosts = async (postId) => {
  const response = await apiClient.get(`/posts/related/${postId}`);
  return response.data;
};
