import api from "./api";

export const createSession = async (payload) => {
  const { data } = await api.post("/sessions", payload);
  return data;
};

export const getSessions = async () => {
  const { data } = await api.get("/sessions");
  return data.sessions;
};

export const getSession = async (sessionId) => {
  const { data } = await api.get(`/sessions/${sessionId}`);
  return data.session;
};
