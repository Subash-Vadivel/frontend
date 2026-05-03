import axiosClient from './axiosClient';

export const getSummary = async () => {
  const { data } = await axiosClient.get('/dashboard/summary');
  return data;
};

export const getMonthlyTotals = async () => {
  const { data } = await axiosClient.get('/dashboard/monthly-totals');
  return data;
};

export const getCategoryTotals = async (type) => {
  const { data } = await axiosClient.get('/dashboard/category-totals', { params: { type } });
  return data;
};
