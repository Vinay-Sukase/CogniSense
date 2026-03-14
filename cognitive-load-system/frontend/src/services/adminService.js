import api from "./api";

export const getAdminStats = async () => {
  const { data } = await api.get("/admin/stats");
  return data;
};

export const getAdminUsers = async () => {
  const { data } = await api.get("/admin/users");
  return data.users;
};

export const getAdminSessions = async () => {
  const { data } = await api.get("/admin/sessions");
  return data.sessions;
};

export const deleteAdminUser = async (userId) => {
  const { data } = await api.delete(`/admin/users/${userId}`);
  return data;
};

export const deleteAdminSession = async (sessionId) => {
  const { data } = await api.delete(`/admin/sessions/${sessionId}`);
  return data;
};
