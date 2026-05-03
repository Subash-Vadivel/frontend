import axiosClient from './axiosClient';

const pathForType = (type) => (type === 'income' ? '/income' : '/expenses');

export const listTransactions = async (type) => {
  const { data } = await axiosClient.get(pathForType(type));
  return data;
};

export const createTransaction = async (type, payload) => {
  const { data } = await axiosClient.post(pathForType(type), payload);
  return data;
};

export const updateTransaction = async (type, id, payload) => {
  const { data } = await axiosClient.put(`${pathForType(type)}/${id}`, payload);
  return data;
};

export const deleteTransaction = async (type, id) => {
  await axiosClient.delete(`${pathForType(type)}/${id}`);
};
