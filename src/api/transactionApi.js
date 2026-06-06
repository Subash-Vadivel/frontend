import axiosClient from './axiosClient';

const pathForType = (type) => (type === 'income' ? '/income' : '/expenses');

const rangeParams = (range = {}) => {
  const params = {};
  if (range.startDate) params.startDate = range.startDate;
  if (range.endDate) params.endDate = range.endDate;
  return params;
};

export const listTransactions = async (type, range) => {
  const { data } = await axiosClient.get(pathForType(type), { params: rangeParams(range) });
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
