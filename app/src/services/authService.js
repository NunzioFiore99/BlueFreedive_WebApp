import axios from 'axios';

// Funzione per effettuare la richiesta di login
// export const loginUser = async (username, password) => {
//   try {
//     const response = await axios.post(API_URL, { username, password });
//     return response.data;  // Ritorna i dati della risposta (es. token)
//   } catch (error) {
//     throw error.response ? error.response.data : new Error('Errore di connessione');
//   }
// };

export const loginUser = async (username, password) => {
  try {
    console.log("stampo: ", process.env.REACT_APP_SERVER_URL);
    const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/login`, { username, password });
    return response.data;
  } catch (error) {
    throw new Error('Login error');
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/signup`, userData);
    return response.data;
  } catch (error) {
    throw new Error('SignUp error');
  }
};