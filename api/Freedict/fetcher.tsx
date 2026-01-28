import apiClient from './index';
// import { FinSwe } from '../../Screens/FinSwe'

//'https://freedictionaryapi.com/api/v1/entries/{language}/{word}?translations=true&pretty=true'

export const getWord = async (language: string, word: string) => {
  try {
    console.log(`Fetching word: ${word} in language: ${language}`);
    console.log("Apiclient address: ", apiClient.defaults.baseURL);
    console.log(`Full URL: ${apiClient.defaults.baseURL}/${language}/${word}?translations=true&pretty=true`);
    const response = await fetch(`${apiClient.defaults.baseURL}/${language}/${word}?translations=true&pretty=true`);
    
    const data = await response.json();
    console.log('Fetched data:', data);
    
    return data;
    
  } catch (error) {
    console.error('Error fetching word:', error);
    throw error;
  }
};