import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.0.2.2:5000/api', // Android emulator usa 10.0.2.2
  // Para iOS simulator ou produção podes mudar
});

export default api;
