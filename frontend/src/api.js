import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const TOKEN_KEY = 'lalita_token';

const client = axios.create({ baseURL: API_URL });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export const api = {
  login: (credentials) => client.post('/auth/login', credentials).then((r) => r.data),
  register: (data) => client.post('/auth/register', data).then((r) => r.data),
  getActivities: (from, to) =>
    client.get('/activities', { params: { from, to } }).then((r) => r.data),
  getDay: (date) => client.get(`/activities/day/${date}`).then((r) => r.data),
  create: (activity) => client.post('/activities', activity).then((r) => r.data),
  update: (id, activity) => client.put(`/activities/${id}`, activity).then((r) => r.data),
  remove: (id) => client.delete(`/activities/${id}`).then((r) => r.data),
  getMotivation: (mood) => client.post('/ai/motivation', { mood }).then((r) => r.data)
};
