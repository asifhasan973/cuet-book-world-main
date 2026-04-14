import axios from 'axios';
import { auth } from '../firebase';

const API = axios.create({
  baseURL: 'http://localhost:5001/api',
});

// Attach Firebase UID to every request
API.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    config.headers['x-firebase-uid'] = user.uid;
  }
  return config;
});

export default API;
