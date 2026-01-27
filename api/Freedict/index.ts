import axios from 'axios';

//'https://freedictionaryapi.com/api/v1/entries/{language}/{word}?translations=true&pretty=true'

const apiClient = axios.create({
  baseURL: 'https://freedictionaryapi.com/api/v1/entries',
  timeout: 10000,
});

export default apiClient;