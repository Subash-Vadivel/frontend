import axiosClient from './axiosClient';

const rangeParams = (range = {}) => {
  const params = {};
  if (range.startDate) params.startDate = range.startDate;
  if (range.endDate) params.endDate = range.endDate;
  return params;
};

export const getSummary = async (range) => {
  const { data } = await axiosClient.get('/dashboard/summary', { params: rangeParams(range) });
  return data;
};

export const getMonthlyTotals = async (range) => {
  const { data } = await axiosClient.get('/dashboard/monthly-totals', { params: rangeParams(range) });
  return data;
};

export const getCategoryTotals = async (type, range) => {
  const { data } = await axiosClient.get('/dashboard/category-totals', {
    params: { type, ...rangeParams(range) },
  });
  return data;
};
