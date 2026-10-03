import axiosClient from './axiosClient';

export const listReports = async () => {
  const { data } = await axiosClient.get('/reports');
  return data;
};

export const createReport = async (payload) => {
  const { data } = await axiosClient.post('/reports', payload);
  return data;
};

export const getReport = async (reportId) => {
  const { data } = await axiosClient.get(`/reports/${reportId}`);
  return data;
};

export const updateReport = async (reportId, payload) => {
  const { data } = await axiosClient.patch(`/reports/${reportId}`, payload);
  return data;
};

export const deleteReport = async (reportId) => {
  await axiosClient.delete(`/reports/${reportId}`);
};

export const createWidget = async (reportId, payload) => {
  const { data } = await axiosClient.post(`/reports/${reportId}/widgets`, payload);
  return data;
};

export const updateWidget = async (reportId, widgetId, payload) => {
  const { data } = await axiosClient.patch(`/reports/${reportId}/widgets/${widgetId}`, payload);
  return data;
};

export const deleteWidget = async (reportId, widgetId) => {
  await axiosClient.delete(`/reports/${reportId}/widgets/${widgetId}`);
};

// items: [{ id, x, y, w, h }] for every widget whose placement changed.
export const saveReportLayout = async (reportId, items) => {
  const { data } = await axiosClient.put(`/reports/${reportId}/layout`, { items });
  return data;
};

// range is the effective range: the report filter, or the widget's own custom range.
export const queryWidget = async ({ chartType, config }, range = {}) => {
  const { data } = await axiosClient.post('/reports/query', {
    chartType,
    config,
    startDate: range.startDate || null,
    endDate: range.endDate || null,
  });
  return data;
};
