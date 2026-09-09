import apiClient from './client';

export const getComments = async (postId) => {
  const response = await apiClient.get(`/comments/${postId}`);
  return response.data;
};

export const addComment = async ({ content, postId }) => {
  const response = await apiClient.post('/comments', { content, postId });
  return response.data;
};

export const deleteComment = async (id) => {
  const response = await apiClient.delete(`/comments/${id}`);
  return response.data;
};
