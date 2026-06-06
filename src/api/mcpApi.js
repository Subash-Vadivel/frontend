import axiosClient from './axiosClient';

export const listMcpApiKeys = async () => {
  const { data } = await axiosClient.get('/mcp/api-keys');
  return data;
};

export const createMcpApiKey = async (payload) => {
  const { data } = await axiosClient.post('/mcp/api-keys', payload);
  return data;
};

export const updateMcpApiKey = async (id, payload) => {
  const { data } = await axiosClient.patch(`/mcp/api-keys/${id}`, payload);
  return data;
};

export const deleteMcpApiKey = async (id) => {
  await axiosClient.delete(`/mcp/api-keys/${id}`);
};
