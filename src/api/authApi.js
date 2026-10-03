import axiosClient from './axiosClient';

export const signup = async (payload) => {
  const { data } = await axiosClient.post('/auth/signup', payload);
  return data;
};

export const login = async (payload) => {
  const { data } = await axiosClient.post('/auth/login', payload);
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await axiosClient.get('/auth/me');
  return data;
};

export const verifyEmail = async (token) => {
  const { data } = await axiosClient.post('/auth/verify-email', { token });
  return data;
};

export const resendVerification = async (email) => {
  const { data } = await axiosClient.post('/auth/resend-verification', { email });
  return data;
};

export const forgotPassword = async (email) => {
  const { data } = await axiosClient.post('/auth/forgot-password', { email });
  return data;
};

export const resetPassword = async (payload) => {
  const { data } = await axiosClient.post('/auth/reset-password', payload);
  return data;
};
