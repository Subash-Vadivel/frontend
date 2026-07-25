import axiosClient from './axiosClient';

export const BUSINESS_STORAGE_KEY = 'farm_accounts_business_id';

export const listBusinesses = async () => {
  const { data } = await axiosClient.get('/businesses');
  return data;
};

export const createBusiness = async (payload) => {
  const { data } = await axiosClient.post('/businesses', payload);
  return data;
};

export const getBusiness = async (id) => {
  const { data } = await axiosClient.get(`/businesses/${id}`);
  return data;
};

export const listBusinessMembers = async (businessId) => {
  const { data } = await axiosClient.get(`/businesses/${businessId}/members`);
  return data;
};

export const listBusinessInvitations = async (businessId) => {
  const { data } = await axiosClient.get(`/businesses/${businessId}/invitations`);
  return data;
};

export const createBusinessInvitation = async (businessId, payload) => {
  const { data } = await axiosClient.post(`/businesses/${businessId}/invitations`, payload);
  return data;
};

export const inspectInvitation = async (token) => {
  const { data } = await axiosClient.get(`/invitations/${token}`);
  return data;
};

export const acceptInvitation = async (token) => {
  const { data } = await axiosClient.post(`/invitations/${token}/accept`);
  return data;
};
