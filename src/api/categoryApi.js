import axiosClient from './axiosClient';

export const createCategory = async (payload) => {
  const { data } = await axiosClient.post('/categories', payload);
  return data;
};

export const listCategories = async (type) => {
  const { data } = await axiosClient.get('/categories', { params: { type } });
  return data;
};
