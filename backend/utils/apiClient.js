import axios from 'axios';

const api = axios.create({ timeout: 15000 });

api.interceptors.response.use(
  (res) => res,
  (err) => {
    return Promise.reject(err);
  }
);

export default api;
