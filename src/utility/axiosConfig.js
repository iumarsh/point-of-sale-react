import axios from 'axios';
import { BASEURL } from '../data/endpoints';

const instance = axios.create({
  baseURL: BASEURL, // Set your base URL
});


instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });
  
  export default instance;
  