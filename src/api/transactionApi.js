import axiosClient from './axiosClient';

const pathForType = (type) => (type === 'income' ? '/income' : '/expenses');

const listParams = (range = {}, { limit, offset, search, sort, order } = {}) => {
  const params = {};
  if (range.startDate) params.startDate = range.startDate;
  if (range.endDate) params.endDate = range.endDate;
  if (limit) params.limit = limit;
  if (offset) params.offset = offset;
  if (search?.trim()) params.search = search.trim();
  if (sort) params.sort = sort;
  if (order) params.order = order;
  return params;
};

// Returns a page: { items, total, limit, offset, hasMore, nextOffset, summary }.
export const listTransactions = async (type, range, options) => {
  const { data } = await axiosClient.get(pathForType(type), { params: listParams(range, options) });
  return data;
};

export const getTransaction = async (type, id) => {
  const { data } = await axiosClient.get(`${pathForType(type)}/${id}`);
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
